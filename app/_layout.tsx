import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { enableScreens } from "react-native-screens";

import { AuthProvider } from "@/context/auth/AuthContext";

// Previene congelamientos y choques de cabeceras nativas al montar sub-navegadores
enableScreens(false);
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Roboto: require("./../assets/fonts/Roboto-Regular.ttf"),
    ...Ionicons.font, // Fuerza la carga de la fuente de iconos
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Evita renderizar las pantallas hasta que las fuentes estén listas
  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen name="offline" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}