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
    }
  | {
      token: null;
      authenticated: false;
      user: null;
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

  // EFECTO 1: Verificar token al iniciar
  useEffect(() => {
    console.log('🎬 EFECTO 1 - Verificar token guardado');
    
    if (Platform.OS !== "android" && Platform.OS !== "ios") {
      console.log('⚠️ NO es Android/iOS - No hay persistencia');
      setIsLoading(false);
      return;
    }

    if (!isConnected) {
      console.log('⚠️ Sin conexión - Esperando...');
      return;
    }

    (async () => {
      const token = await SecureStore.getItemAsync(env.TOKEN_KEY);
      console.log('🔑 TOKEN FROM STORAGE:', token ? 'EXISTS (' + token.substring(0, 20) + '...)' : 'NULL');

      if (!token) {
        console.log('❌ No hay token guardado');
        setIsLoading(false);
        return;
      }
      try {
        console.log('🔄 Validando token con backend...');
        const response = await axios.get(buildUrl("users/me"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });

      console.log('✅ TOKEN VALIDATED - USER AUTHENTICATED');
      console.log('👤 USER TYPE:', response.data.type);
      
      setAuth({
        token: token!,
        authenticated: true,
        user: response.data,
      });
      } catch (error) {
        console.log('❌ TOKEN VALIDATION FAILED:', error);
        setAuth({
          token: null,
          authenticated: false,
          user: null,
        });
      } finally {
        setIsLoading(false);
        console.log('🏁 Verificación de token completada');
      }
    })();
  }, [isConnected]);

  // EFECTO 2: Guardar/borrar token cuando auth cambia
  useEffect(() => {
    console.log('🎬 EFECTO 2 - Guardar/borrar token');
    
    if (!isConnected) return;

    (async () => {
      if (auth.authenticated) {
        const token = auth.token;

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log('💾 Guardando token en SecureStore...');

        if (Platform.OS !== "android" && Platform.OS !== "ios") return;
        await SecureStore.setItemAsync(env.TOKEN_KEY, token);
        console.log('✅ Token guardado');
      } else {
        axios.defaults.headers.common["Authorization"] = "";
        console.log('🗑️ Borrando token de SecureStore...');

        if (Platform.OS !== "android" && Platform.OS !== "ios") return;
        await SecureStore.deleteItemAsync(env.TOKEN_KEY);
        console.log('✅ Token borrado');
      }
    })();
  }, [isConnected, auth.token]);

// EFECTO 3: Navegación según estado de auth
  useEffect(() => {
    console.log('🎬 EFECTO 3 - Navegación');

    // Ignorar si isConnected es null (el SDK aún está detectando la red)
    if (isConnected === null || isLoading) {
      console.log('⏸️ Esperando... (isConnected o isLoading)');
      return;
    }

    // Lógica de protección de rutas
    const inAuthGroup = segments.includes("(protected)" as never);
    console.log('🔒 En zona protegida:', inAuthGroup);

    if (!auth.authenticated && inAuthGroup) {
      console.log('🚫 No autenticado en zona protegida - Redirigiendo a login');
      router.replace("/");
    } else if (auth.authenticated && !inAuthGroup) {
      console.log('✅ Autenticado - Redirigiendo a /bienestar');
      router.replace("/(protected)/bienestar");
    }
  }, [isConnected, auth.authenticated, isLoading]);

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