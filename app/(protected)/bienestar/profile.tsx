import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Pressable,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { useForm } from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/bienestar/primitives/Text";
import { Button } from "@/components/bienestar/from/Button";
import { TextInputController } from "@/components/bienestar/from/TextInput";
import { useAuth } from "@/context/auth/AuthContext";
import { Colors } from "@/constants/bienestar/colors";
import { env } from "@/lib/bienestar/env";
import { buildUrl } from "@/lib/bienestar/api";

type ChangePasswordFormData = {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};

export default function Profile() {
  const { auth, setAuth, user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const newPasswordValue = watch("password");

  const handleLogout = async () => {
    try {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        await SecureStore.deleteItemAsync(env.TOKEN_KEY);
      }
    } catch (e) {
      console.log("Error al borrar token:", e);
    }

    setAuth({
      authenticated: false,
      token: null,
      user: null,
    });

    router.replace("/(auth)");
  };

  const onChangePassword = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    Keyboard.dismiss();

    try {
      console.log("🔄 Enviando solicitud de cambio de contraseña...");
      const response = await axios.post(
        buildUrl("auth/change-password", false),
        {
          currentPassword: data.currentPassword,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      console.log("✅ Contraseña cambiada exitosamente");
      setSuccessMsg("¡Contraseña actualizada correctamente!");
      reset();

      if (response.data?.jwt) {
        setAuth({
          ...auth,
          token: response.data.jwt,
          user: response.data.user || auth.user,
        });
        if (Platform.OS === "android" || Platform.OS === "ios") {
          await SecureStore.setItemAsync(env.TOKEN_KEY, response.data.jwt);
        }
      }

      Alert.alert("¡Éxito!", "Tu contraseña ha sido cambiada correctamente.");
    } catch (error: any) {
      console.error("❌ Error al cambiar contraseña:", error?.response?.data || error.message);
      const serverError = error?.response?.data?.error?.message;

      if (
        serverError === "Identifier or password invalid" ||
        serverError?.toLowerCase().includes("current password")
      ) {
        setErrorMsg("La contraseña actual no es correcta.");
      } else {
        setErrorMsg(serverError || "No se pudo cambiar la contraseña. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: Math.max(16, insets.top) }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(40, insets.bottom + 20) },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* 1. ENCABEZADO Y PERFIL */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <ExpoImage
            source={require("@/assets/images/Perfil.png")}
            style={{ width: 90, height: 90 }}
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

      {/* 2. INFORMACIÓN DE LA CUENTA */}
      <View style={styles.infoSection}>
        <Text type="defaultBold" color="primary" style={styles.sectionTitle}>
          Información de la Cuenta
        </Text>
        <View style={styles.infoRow}>
          <Text color="gray">Tipo de Usuario:</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {user?.type === "student" ? "ESTUDIANTE" : "GESTOR"}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text color="gray">Correo Institucional:</Text>
          <Text color="primary" style={{ fontWeight: "600", fontSize: 13 }}>
            {user?.email || "Sin correo"}
          </Text>
        </View>
      </View>

      {/* 3. SECCIÓN DE CAMBIO DE CONTRASEÑA */}
      <View style={styles.card}>
        <Pressable
          onPress={() => setShowPasswordForm(!showPasswordForm)}
          style={styles.cardToggleHeader}
        >
          <View style={styles.cardTitleRow}>
            <MaterialCommunityIcons
              name="shield-lock-outline"
              size={22}
              color={Colors.primary}
            />
            <Text type="defaultBold" color="primary" style={{ fontSize: 16 }}>
              Cambiar Contraseña
            </Text>
          </View>
          <MaterialCommunityIcons
            name={showPasswordForm ? "chevron-up" : "chevron-down"}
            size={24}
            color="#64748B"
          />
        </Pressable>

        {showPasswordForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formInstructions}>
              Ingresa tu contraseña actual y define tu nueva contraseña.
            </Text>

            {successMsg && (
              <View style={styles.successBanner}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color="#16A34A"
                />
                <Text style={styles.successText}>{successMsg}</Text>
              </View>
            )}

            {errorMsg && (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={18}
                  color={Colors.secondary}
                />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            <View style={styles.fieldGap}>
              <View>
                <Text style={styles.fieldLabel}>CONTRASEÑA ACTUAL</Text>
                <TextInputController
                  name="currentPassword"
                  control={control}
                  errors={errors}
                  rules={{
                    required: "Ingresa tu contraseña actual",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  }}
                  inputProps={{
                    placeholder: "Contraseña actual",
                    leftIcon: "lock-outline",
                    isPassword: true,
                    autoCapitalize: "none",
                  }}
                />
              </View>

              <View>
                <Text style={styles.fieldLabel}>NUEVA CONTRASEÑA</Text>
                <TextInputController
                  name="password"
                  control={control}
                  errors={errors}
                  rules={{
                    required: "Ingresa la nueva contraseña",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  }}
                  inputProps={{
                    placeholder: "Mínimo 6 caracteres",
                    leftIcon: "lock-plus-outline",
                    isPassword: true,
                    autoCapitalize: "none",
                  }}
                />
              </View>

              <View>
                <Text style={styles.fieldLabel}>CONFIRMAR NUEVA CONTRASEÑA</Text>
                <TextInputController
                  name="passwordConfirmation"
                  control={control}
                  errors={errors}
                  rules={{
                    required: "Confirma la nueva contraseña",
                    validate: (value) =>
                      value === newPasswordValue ||
                      "Las contraseñas no coinciden",
                  }}
                  inputProps={{
                    placeholder: "Repite la nueva contraseña",
                    leftIcon: "lock-check-outline",
                    isPassword: true,
                    autoCapitalize: "none",
                  }}
                />
              </View>

              <View style={{ marginTop: 8 }}>
                {isLoading ? (
                  <ActivityIndicator size="large" color={Colors.secondary} />
                ) : (
                  <Button
                    title="ACTUALIZAR CONTRASEÑA"
                    onPress={handleSubmit(onChangePassword)}
                    color="secondary"
                  />
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 4. BOTÓN CERRAR SESIÓN */}
      <View style={styles.logoutContainer}>
        <Button
          title="CERRAR SESIÓN"
          onPress={handleLogout}
          color="accent"
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
    marginBottom: 24,
    marginTop: 10,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
  },
  infoSection: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardToggleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8FAFC",
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  formContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  formInstructions: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 16,
    lineHeight: 18,
  },
  fieldGap: {
    gap: 14,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#86EFAC",
    marginBottom: 14,
  },
  successText: {
    fontSize: 13,
    color: "#16A34A",
    fontWeight: "600",
    flex: 1,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    marginBottom: 14,
  },
  errorText: {
    fontSize: 13,
    color: Colors.secondary,
    fontWeight: "600",
    flex: 1,
  },
  logoutContainer: {
    width: "100%",
  },
});

