import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Text } from "@/components/bienestar/primitives/Text";
import { Button } from "@/components/bienestar/from/Button";
import { useAuth } from "@/context/auth/AuthContext";
import { Colors } from "@/constants/bienestar/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const { setAuth, user } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    setAuth({
      authenticated: false,
      token: null,
      user: null,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <ExpoImage
            source={require("@/assets/images/Perfil.png")}
            style={{ width: 100, height: 100 }}
            tintColor={Colors.primary}
            contentFit="contain"
          />
        </View>
        <Text type="subtitle" color="primary" style={styles.userName}>
          {user?.name || "Usuario"}
        </Text>
        <Text color="gray" style={styles.userEmail}>
          {user?.email || ""}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text type="defaultBold" color="primary" style={styles.sectionTitle}>
          Información de la Cuenta
        </Text>
        <View style={styles.infoRow}>
          <Text color="gray">Tipo de Usuario:</Text>
          <Text color="primary" style={{ fontWeight: "600" }}>
            {user?.type === "student" ? "Estudiante" : "Gestor"}
          </Text>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <Button
          title="Cerrar Sesión"
          onPress={handleLogout}
          color="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  infoSection: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  logoutContainer: {
    width: "100%",
    marginTop: "auto",
  },
});
