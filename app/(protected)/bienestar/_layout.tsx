import { Tabs, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Image, View } from "react-native";
import { Colors } from "@/constants/bienestar/colors";
import { Text } from "@/components/bienestar/primitives/Text";
import * as Notifications from 'expo-notifications';

/**
 * TabLayout con Imágenes Personalizadas e Indicador de Avisos
 */
export default function TabLayout() {
  const segments = useSegments();
  const hideTabBar = segments.includes("action-line");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Escuchar notificaciones entrantes para aumentar el contador
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      if (notification.request.content.data?.type === 'reminder') {
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => subscription.remove();
  }, []);

  // Si el usuario entra a la pestaña de avisos, reseteamos el contador
  const isAtReminders = segments.includes("reminders");
  useEffect(() => {
    if (isAtReminders) {
      setUnreadCount(0);
    }
  }, [isAtReminders]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: "#94A3B8",
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "bold",
          marginBottom: 5,
        },
        tabBarStyle: hideTabBar ? { display: "none" } : styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/Home.png")}
              style={[styles.icon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="welfare"
        options={{
          title: "Bienestar",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/Bienestar.png")}
              style={[styles.icon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Avisos",
          tabBarIcon: ({ color }) => (
            <View>
              <Image
                source={require("@/assets/images/Recordatorios.png")}
                style={[styles.icon, { tintColor: color }]}
                resizeMode="contain"
              />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/Perfil.png")}
              style={[styles.icon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen name="create" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    height: 65,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    elevation: 8,
    paddingTop: 5,
  },
  icon: {
    width: 26,
    height: 26,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#EF4444', // Rojo intenso
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  }
});
