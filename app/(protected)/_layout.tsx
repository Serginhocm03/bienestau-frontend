import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function ProtectedLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#FFFFFF",
            width: 280,
          },
          drawerActiveTintColor: "#2563EB",
          drawerInactiveTintColor: "#64748B",
          drawerLabelStyle: {
            fontWeight: "600",
            fontSize: 15,
          },
        }}
      >
        <Drawer.Screen
          name="bienestar"
          options={{
            drawerLabel: "Bienestar",
            title: "Bienestar",
          }}
        />
        <Drawer.Screen
          name="carnet/index"
          options={{
            drawerLabel: "Carnet",
            title: "Carnet",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}