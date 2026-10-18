import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/bienestar/colors";
import { useAuth } from "@/context/auth/AuthContext";
import { postApi } from "@/lib/bienestar/api";
import { TextInputController } from "@/components/bienestar/from/TextInput";
import { Button } from "@/components/bienestar/from/Button";
import { Text } from "@/components/bienestar/primitives/Text";
import {
  AuthResetPasswordRequest,
  AuthResetPasswordResponse,
  ErrorResponse,
} from "@/types/bienestar/dto";

export default function ResetPassword() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthResetPasswordRequest>({
    defaultValues: {
      code: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const newPassword = watch("password");

  const mutation = useMutation<
    AuthResetPasswordResponse,
    AxiosError<ErrorResponse>,
    AuthResetPasswordRequest
  >({
    mutationFn: postApi("auth/reset-password"),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* BRANDING HEADER */}
            <View style={styles.headerBox}>
              <View style={styles.logoBadge}>
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={styles.logoImage}
                />
              </View>
              <Text style={styles.titleText}>Bienestar Institucional</Text>
              <Text style={styles.subtitleText}>Universidad CESMAG</Text>
            </View>

            {/* FORM CARD */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Restablecer Contraseña</Text>
                <Text style={styles.cardSubtitle}>
                  Ingresa el código que enviamos a tu correo e introduce tu nueva contraseña.
                </Text>
              </View>

              {error && (
                <View style={styles.errorBanner}>
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={20}
                    color={Colors.secondary}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.formGap}>
                <TextInputController
                  name="code"
                  control={control}
                  errors={errors}
                  inputProps={{
                    autoCapitalize: "none",
                    placeholder: "Código / Token de verificación",
                    leftIcon: "key-outline",
                  }}
                  rules={{
                    required: "El código de verificación es obligatorio",
                  }}
                />

                <TextInputController
                  name="password"
                  control={control}
                  errors={errors}
                  inputProps={{
                    autoCapitalize: "none",
                    placeholder: "Nueva contraseña",
                    leftIcon: "lock-outline",
                    isPassword: true,
                  }}
                  rules={{
                    required: "La nueva contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  }}
                />

                <TextInputController
                  name="passwordConfirmation"
                  control={control}
                  errors={errors}
                  inputProps={{
                    autoCapitalize: "none",
                    placeholder: "Confirmar nueva contraseña",
                    leftIcon: "lock-check-outline",
                    isPassword: true,
                  }}
                  rules={{
                    required: "Debes confirmar la contraseña",
                    validate: (value) =>
                      value === newPassword || "Las contraseñas no coinciden",
                  }}
                />

                <Button
                  isLoading={isLoading}
                  onPress={handleSubmit((data) => {
                    setError(null);
                    setIsLoading(true);
                    Keyboard.dismiss();

                    mutation.mutate(data, {
                      onSuccess: (resData) => {
                        Alert.alert(
                          "¡Contraseña Actualizada!",
                          "Tu contraseña ha sido restablecida exitosamente. Se ha iniciado sesión con tu nueva contraseña.",
                          [
                            {
                              text: "Continuar",
                              onPress: () => {
                                setAuth({
                                  token: resData.jwt,
                                  authenticated: true,
                                  user: resData.user,
                                });
                              },
                            },
                          ]
                        );
                      },
                      onError: (err) => {
                        if (err.response?.data?.error?.message) {
                          setError(err.response.data.error.message);
                        } else {
                          setError(
                            "El código es inválido o ha expirado. Por favor solicita uno nuevo."
                          );
                        }
                      },
                      onSettled: () => {
                        setIsLoading(false);
                      },
                    });
                  })}
                  title="ACTUALIZAR CONTRASEÑA"
                />
              </View>

              {/* FOOTER LINK */}
              <View style={styles.footerRow}>
                <Pressable onPress={() => router.replace("/(auth)")}>
                  <Text style={styles.backLink}>Volver al inicio de sesión</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 10,
  },
  logoImage: {
    width: 65,
    height: 65,
    resizeMode: "contain",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.secondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: Colors.secondary,
    flex: 1,
    fontWeight: "600",
  },
  formGap: {
    gap: 16,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  backLink: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});
