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
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/bienestar/colors";
import { postApi } from "@/lib/bienestar/api";
import { TextInputController } from "@/components/bienestar/from/TextInput";
import { Button } from "@/components/bienestar/from/Button";
import { Text } from "@/components/bienestar/primitives/Text";
import {
  AuthForgotPasswordRequest,
  AuthForgotPasswordResponse,
  ErrorResponse,
} from "@/types/bienestar/dto";

export default function ForgotPassword() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthForgotPasswordRequest>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const mutation = useMutation<
    AuthForgotPasswordResponse,
    AxiosError<ErrorResponse>,
    AuthForgotPasswordRequest
  >({
    mutationFn: postApi("auth/forgot-password"),
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
              {!isSent ? (
                <>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Recuperar Contraseña</Text>
                    <Text style={styles.cardSubtitle}>
                      Ingresa tu correo institucional y te enviaremos un código para restablecer tu contraseña.
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
                      name="email"
                      control={control}
                      errors={errors}
                      inputProps={{
                        autoCapitalize: "none",
                        keyboardType: "email-address",
                        placeholder: "Correo institucional",
                        leftIcon: "email-outline",
                      }}
                      rules={{
                        required: "El correo electrónico es obligatorio",
                        minLength: {
                          value: 6,
                          message: "El correo debe tener al menos 6 caracteres",
                        },
                        pattern: {
                          value: /^[A-Za-z0-9._%+-]+@unicesmag\.edu\.co$/i,
                          message:
                            "Ingresa un correo institucional válido (@unicesmag.edu.co)",
                        },
                      }}
                    />

                    <Button
                      isLoading={isLoading}
                      onPress={handleSubmit((data) => {
                        setError(null);
                        setIsLoading(true);
                        setSentEmail(data.email);
                        Keyboard.dismiss();

                        mutation.mutate(data, {
                          onSuccess: () => {
                            setIsSent(true);
                          },
                          onError: (err) => {
                            const status = err.response?.status;
                            const rawMsg = err.response?.data?.error?.message;

                            if (status === 500 || rawMsg === "Internal Server Error") {
                              setError(
                                "El servicio de correo electrónico en el servidor aún no está configurado (SMTP). Por favor contacta con el administrador de UNICESMAG."
                              );
                            } else if (rawMsg) {
                              setError(rawMsg);
                            } else {
                              setError("No se pudo procesar la solicitud. Por favor intenta más tarde.");
                            }
                          },
                          onSettled: () => {
                            setIsLoading(false);
                          },
                        });
                      })}
                      title="ENVIAR CÓDIGO DE RECUPERACIÓN"
                    />
                  </View>
                </>
              ) : (
                <View style={styles.successBox}>
                  <View style={styles.successIconCircle}>
                    <MaterialCommunityIcons
                      name="email-check-outline"
                      size={40}
                      color={Colors.primary}
                    />
                  </View>

                  <Text style={styles.successTitle}>¡Correo Enviado!</Text>
                  <Text style={styles.successMessage}>
                    Hemos enviado las instrucciones y el código de recuperación a{" "}
                    <Text style={{ fontWeight: "bold", color: Colors.primary }}>
                      {sentEmail}
                    </Text>
                    . Por favor revisa tu bandeja de entrada o la carpeta de spam.
                  </Text>

                  <View style={{ gap: 12, width: "100%", marginTop: 12 }}>
                    <Button
                      title="RESTABLECER CONTRASEÑA"
                      onPress={() =>
                        router.push({
                          pathname: "/(auth)/reset-password",
                          params: { email: sentEmail },
                        })
                      }
                    />

                    <Button
                      type="text"
                      title="Reintentar con otro correo"
                      onPress={() => setIsSent(false)}
                    />
                  </View>
                </View>
              )}

              {/* FOOTER LINK */}
              <View style={styles.footerRow}>
                <Pressable onPress={() => router.back()}>
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
  successBox: {
    alignItems: "center",
    paddingVertical: 10,
  },
  successIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
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
