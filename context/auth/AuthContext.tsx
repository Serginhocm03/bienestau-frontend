import axios from "axios";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { env } from "@/lib/bienestar/env";
import { useRouter, useSegments } from "expo-router";
import { buildUrl } from "@/lib/bienestar/api";
import { useNetInfo } from "@react-native-community/netinfo";
import { registerForPushNotificationsAsync, registerTokenWithBackend } from '@/lib/bienestar/notifications';
import { User } from "@/types/bienestar/collections";


export type Auth =
  | {
      token: string;
      authenticated: true;
      user: User;
      rememberMe?: boolean;
    }
  | {
      token: null;
      authenticated: false;
      user: null;
      rememberMe?: boolean;
    };

const DefaultAuth: Auth = {
  token: null,
  authenticated: false,
  user: null,
};

export interface AuthContextProps {
  auth: Auth;
  setAuth: (state: Auth) => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  auth: DefaultAuth,
  setAuth: () => {},
  user: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { isConnected } = useNetInfo();
  const [auth, setAuth] = useState<Auth>(DefaultAuth);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  console.log('🔍 AUTH STATE:', { authenticated: auth.authenticated, hasToken: !!auth.token, isLoading });

  // EFECTO 1: Verificar token e iniciar sesión persistente
  useEffect(() => {
    console.log('🎬 EFECTO 1 - Verificar token guardado');
    
    if (Platform.OS !== "android" && Platform.OS !== "ios") {
      console.log('⚠️ NO es Android/iOS - No hay persistencia');
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const token = await SecureStore.getItemAsync(env.TOKEN_KEY);
        const cachedUserDataStr = await SecureStore.getItemAsync("bienestau_user_data");

        console.log('🔑 TOKEN FROM STORAGE:', token ? 'EXISTS (' + token.substring(0, 20) + '...)' : 'NULL');

        if (!token) {
          console.log('❌ No hay token guardado');
          setIsLoading(false);
          return;
        }

        let cachedUser: User | null = null;
        if (cachedUserDataStr) {
          try {
            cachedUser = JSON.parse(cachedUserDataStr);
          } catch (_) {}
        }

        // Configurar inmediatamente la cabecera HTTP de Authorization
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Restaurar la sesión de inmediato si hay datos guardados localmente
        if (cachedUser) {
          console.log('⚡ Sesión restaurada de forma instantánea');
          setAuth({
            token,
            authenticated: true,
            user: cachedUser,
          });
        }

        // Validar asíncronamente con el backend sin cerrar la sesión si falla la red
        try {
          console.log('🔄 Validando token con backend...');
          const response = await axios.get(buildUrl("users/me"), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 15000,
          });

          console.log('✅ TOKEN VALIDADO CON ÉXITO');
          await SecureStore.setItemAsync("bienestau_user_data", JSON.stringify(response.data));

          setAuth({
            token,
            authenticated: true,
            user: response.data,
          });
        } catch (error: any) {
          console.log('⚠️ Validación con servidor no completada:', error?.message);

          const status = error?.response?.status;
          // ÚNICAMENTE si el servidor rechaza explícitamente el token (HTTP 401 o 403)
          if (status === 401 || status === 403) {
            console.log('❌ TOKEN RECHAZADO POR EL SERVIDOR (HTTP 401/403) - CERRANDO SESIÓN');
            await SecureStore.deleteItemAsync(env.TOKEN_KEY);
            await SecureStore.deleteItemAsync("bienestau_user_data");
            setAuth({
              token: null,
              authenticated: false,
              user: null,
            });
          } else {
            console.log('ℹ️ Mantiendo sesión activa localmente (error de red o servidor en reposo)');
            if (!cachedUser) {
              setAuth({
                token,
                authenticated: true,
                user: {
                  id: 0,
                  documentId: '',
                  email: '',
                  username: '',
                  type: 'student',
                  provider: 'local',
                  blocked: false,
                  confirmed: true,
                  createdAt: '',
                  updatedAt: '',
                  publishedAt: ''
                },
              });
            }
          }
        }
      } catch (e) {
        console.error('Error leyendo SecureStore:', e);
      } finally {
        setIsLoading(false);
        console.log('🏁 Verificación de token completada');
      }
    })();
  }, []);

  // EFECTO 2: Guardar/borrar token cuando auth cambia
  useEffect(() => {
    console.log('🎬 EFECTO 2 - Guardar/borrar token');
    (async () => {
      if (auth.authenticated && auth.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;

        if (Platform.OS === "android" || Platform.OS === "ios") {
          console.log('💾 Guardando token y datos de usuario en SecureStore...');
          await SecureStore.setItemAsync(env.TOKEN_KEY, auth.token);
          if (auth.user) {
            await SecureStore.setItemAsync("bienestau_user_data", JSON.stringify(auth.user));
          }
          console.log('✅ Sesión guardada persistentemente');
        }
      } else {
        axios.defaults.headers.common["Authorization"] = "";
        console.log('🗑️ Borrando datos de sesión en SecureStore...');

        if (Platform.OS === "android" || Platform.OS === "ios") {
          await SecureStore.deleteItemAsync(env.TOKEN_KEY);
          await SecureStore.deleteItemAsync("bienestau_user_data");
          console.log('✅ Sesión borrada completamente');
        }
      }
    })();
  }, [auth.authenticated, auth.token, auth.user]);

  // EFECTO 3: Navegación según estado de auth
  useEffect(() => {
    console.log('🎬 EFECTO 3 - Navegación');

    if (isLoading) {
      console.log('⏸️ Esperando... (isLoading)');
      return;
    }

    // Lógica de protección de rutas
    const inAuthGroup = segments.includes("(protected)" as never);
    console.log('🔒 En zona protegida:', inAuthGroup, 'Auth:', auth.authenticated);

    if (!auth.authenticated && inAuthGroup) {
      console.log('🚫 No autenticado en zona protegida - Redirigiendo a login');
      router.replace("/(auth)");
    } else if (auth.authenticated && !inAuthGroup) {
      console.log('✅ Autenticado - Redirigiendo a /bienestar');
      router.replace("/(protected)/bienestar");
    }
  }, [auth.authenticated, isLoading, segments]);

  // EFECTO 4: Registrar token de notificaciones después del login
useEffect(() => {
  if (!auth.authenticated) return;

  (async () => {
    console.log('🔔 Registrando token de notificaciones...');
    const token = await registerForPushNotificationsAsync();
    
    if (token) {
      await registerTokenWithBackend(token);
    }
  })();
}, [auth.authenticated]);

const value = {
  auth,
  setAuth,
  user: auth.authenticated ? auth.user : null,
};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};