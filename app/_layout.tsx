import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { enableScreens } from "react-native-screens";
import * as Notifications from 'expo-notifications';

import { AuthProvider } from "@/context/auth/AuthContext";
import axios from "axios";
import { buildUrl } from "@/lib/bienestar/api";

import { Platform } from "react-native";

// Configuración global para que las notificaciones muestren banner arriba aunque la app esté abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Configurar canal de máxima importancia en Android al arrancar la app
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Alertas BienestAU',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#004A8B',
    showBadge: true,
    sound: 'default',
  });
}

// Previene congelamientos y choques de cabeceras nativas al montar sub-navegadores
enableScreens(false);
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutos de cache activo
      gcTime: 1000 * 60 * 60 * 24, // 24 horas en memoria local
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

import { MaterialCommunityIcons, MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";

import { useRef } from "react";

function RootServices() {
  const router = useRouter();
  const lastNotifiedIdRef = useRef<string | number | null>(null);

  // KEEP-ALIVE y Monitor de Avisos en tiempo real
  useEffect(() => {
    const checkNewReminders = async () => {
      try {
        // Ping servidor
        await axios.get(buildUrl('home', false));

        // Consultar avisos recientes
        const remindersUrl = buildUrl('reminders', false) + '?sort=createdAt:desc&pagination[limit]=1';
        const res = await axios.get(remindersUrl);
        const latestReminder = res.data?.data?.[0];

        if (latestReminder) {
          const currentId = latestReminder.documentId || latestReminder.id;

          if (lastNotifiedIdRef.current === null) {
            // Primera carga: registrar el ID actual sin notificar
            lastNotifiedIdRef.current = currentId;
          } else if (lastNotifiedIdRef.current !== currentId) {
            // Se detectó una nueva noticia o evento publicado
            console.log('✨ [NUEVO AVISO DETECTADO]:', latestReminder.title);
            lastNotifiedIdRef.current = currentId;

            // Disparar notificación nativa en la barra superior del celular de inmediato
            await Notifications.scheduleNotificationAsync({
              content: {
                title: latestReminder.title || 'BienestAU 🔔',
                body: latestReminder.description || 'Nuevo aviso publicado en BienestAU',
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
                data: {
                  contentType: latestReminder.contentType,
                  contentId: latestReminder.contentId,
                },
              },
              trigger: null,
            });
          }
        }
      } catch (e) {
        console.log('📡 Keep-alive / Monitor Sync');
      }
    };

    checkNewReminders();
    const interval = setInterval(checkNewReminders, 12000); // Revisa cada 12 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Escuchar notificaciones cuando la app está abierta
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title } = notification.request.content;
      console.log('🔔 Notificación recibida en primer plano:', title);
    });

    // Escuchar cuando el usuario TOCA la notificación
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      if (data?.contentType && data?.contentId) {
        setTimeout(() => {
          router.push("/(protected)/bienestar/reminders");
        }, 500);
      }
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, [router]);

  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Roboto": require("./../assets/fonts/Roboto-Regular.ttf"),
    ...MaterialCommunityIcons.font,
    ...MaterialIcons.font,
    ...FontAwesome.font,
    ...Ionicons.font,
  });

  useEffect(() => {
    if (error) console.error("Error cargando fuentes:", error);
  }, [error]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootServices />
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen name="offline" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
