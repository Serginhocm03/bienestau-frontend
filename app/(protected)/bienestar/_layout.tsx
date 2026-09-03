import { Tabs, useSegments } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/bienestar/colors";

/**
 * TabLayout - Configuración de la barra de navegación inferior (Bottom Tabs)
 * Se ha reconstruido desde cero para asegurar la visibilidad de los iconos y el cumplimiento de colores.
 */
export default function TabLayout() {
  const segments = useSegments();

  // Ocultar la barra si estamos en pantallas de detalle profundo
  const hideTabBar = segments.includes("action-line");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Configuración de colores (OBLIGATORIO NEGRO para iconos y texto)
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#000000",
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? 0 : 5,
        },
        tabBarStyle: hideTabBar ? { display: "none" } : styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color="#000000"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="welfare"
        options={{
          title: "Bienestar",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={24}
              color="#000000"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Recordatorios",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={24}
              color="#000000"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color="#000000"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    height: 65,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    // Sombras para darle un toque premium
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
