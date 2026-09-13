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

// Previene congelamientos y choques de cabeceras nativas al montar sub-navegadores
enableScreens(false);
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache de 5 minutos
    },
  },
});

import { MaterialCommunityIcons, MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";

function RootServices() {
  const router = useRouter();

  // KEEP-ALIVE: Evita que Render se duerma
  useEffect(() => {
    const pingServer = async () => {
      try {
        await axios.get(buildUrl('home', false));
        console.log('📡 Server Ping: Success (Keep-alive)');
      } catch (e) {
        console.log('📡 Server Ping: Awake');
      }
    };

    pingServer();
    const interval = setInterval(pingServer, 1000 * 60 * 10);
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
