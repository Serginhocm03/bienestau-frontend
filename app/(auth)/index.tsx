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
import Checkbox from "expo-checkbox";

import { Colors } from "@/constants/bienestar/colors";
import { useAuth } from "@/context/auth/AuthContext";
import { postApi } from "@/lib/bienestar/api";
import { TextInputController } from "@/components/bienestar/from/TextInput";
import { Button } from "@/components/bienestar/from/Button";
import { Text } from "@/components/bienestar/primitives/Text";
import {
  AuthLocalRequest,
  AuthLocalResponse,
  ErrorResponse,
} from "@/types/bienestar/dto";

export default function Login() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthLocalRequest>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const mutation = useMutation<
    AuthLocalResponse,
    AxiosError<ErrorResponse>,
    AuthLocalRequest
  >({
    mutationFn: postApi("auth/local"),
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
              <Text style={styles.subtitleText}>
                Universidad CESMAG
              </Text>
            </View>

            {/* FORM CARD */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Iniciar Sesión</Text>
                <Text style={styles.cardSubtitle}>
                  Ingresa tus credenciales institucionales para acceder
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
                  name="identifier"
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
                      message:
                        "El correo electrónico debe tener al menos 6 caracteres",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9._%+-]+@unicesmag\.edu\.co$/i,
                      message:
                        "Ingresa un correo institucional válido (@unicesmag.edu.co)",
                    },
                  }}
                />

                <TextInputController
                  name="password"
                  control={control}
                  errors={errors}
                  inputProps={{
                    autoCapitalize: "none",
                    placeholder: "Contraseña",
                    leftIcon: "lock-outline",
                    isPassword: true,
                  }}
                  rules={{
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  }}
                />

                <View style={styles.rememberMeRow}>
                  <Checkbox
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    color={rememberMe ? Colors.primary : undefined}
                    style={styles.checkbox}
                  />
                  <Pressable onPress={() => setRememberMe(!rememberMe)}>
                    <Text style={styles.rememberMeText}>
                      Mantener sesión iniciada
                    </Text>
                  </Pressable>
                </View>

                <Button
                  isLoading={isLoading}
                  onPress={handleSubmit((data) => {
                    setError(null);
                    setIsLoading(true);
                    Keyboard.dismiss();

                    mutation.mutate(data, {
                      onSuccess: (data) => {
                        setAuth({
                          token: data.jwt,
                          authenticated: true,
                          user: data.user,
                          rememberMe: rememberMe,
                        });
                      },
                      onError: (error) => {
                        if (error.status === 400) {
                          setError(
                            "Correo electrónico o contraseña incorrectos"
                          );
                        } else {
                          setError(
                            "Error del servidor, por favor intente más tarde"
                          );
                        }
                      },
                      onSettled: () => {
                        setIsLoading(false);
                      },
                    });
                  })}
                  title="INICIAR SESIÓN"
                />
              </View>

              {/* FOOTER LINK */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>¿Aún no tienes una cuenta?</Text>
                <Pressable onPress={() => router.push("/(auth)/register")}>
                  <Text style={styles.registerLink}>Regístrate aquí</Text>
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
    marginBottom: 24,
  },
  logoBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    marginBottom: 12,
  },
  logoImage: {
    width: 75,
    height: 75,
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
  rememberMeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: -4,
    marginBottom: 4,
  },
  checkbox: {
    borderRadius: 4,
  },
  rememberMeText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerText: {
    fontSize: 13,
    color: "#64748B",
  },
  registerLink: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});
