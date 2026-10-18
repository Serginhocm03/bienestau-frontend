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
  Linking,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import Checkbox from "expo-checkbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/bienestar/colors";
import { useAuth } from "@/context/auth/AuthContext";
import { postApi } from "@/lib/bienestar/api";
import { TextInputController } from "@/components/bienestar/from/TextInput";
import { Button } from "@/components/bienestar/from/Button";
import { Text } from "@/components/bienestar/primitives/Text";
import {
  AuthLocalRegisterRequest,
  AuthLocalRegisterResponse,
} from "@/types/bienestar/dto";

export default function Register() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthLocalRegisterRequest>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      type: "student",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const mutation = useMutation<
    AuthLocalRegisterResponse,
    AxiosError,
    AuthLocalRegisterRequest
  >({
    mutationFn: postApi("auth/local/register"),
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
                <Text style={styles.cardTitle}>Crear Cuenta</Text>
                <Text style={styles.cardSubtitle}>
                  Registra tus datos con tu correo institucional UNICESMAG
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
                  name="name"
                  control={control}
                  errors={errors}
                  inputProps={{
                    placeholder: "Nombre completo",
                    leftIcon: "account-outline",
                  }}
                  rules={{
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 6,
                      message: "El nombre debe tener al menos 6 caracteres",
                    },
                  }}
                />

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

                {/* TERMS CHECKBOX */}
                <View style={styles.termsBox}>
                  <Checkbox
                    value={acceptedTerms}
                    onValueChange={(val) => {
                      setAcceptedTerms(val);
                      if (val) setTermsError(false);
                    }}
                    color={acceptedTerms ? Colors.primary : undefined}
                    style={styles.checkbox}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.termsText}>
                      Acepto los{" "}
                      <Text
                        style={styles.termsLink}
                        onPress={() =>
                          Linking.openURL(
                            "https://www.unicesmag.edu.co/documentos/DATOS-UNICESMAG.pdf"
                          )
                        }
                      >
                        términos y condiciones
                      </Text>{" "}
                      y la{" "}
                      <Text
                        style={styles.termsLink}
                        onPress={() =>
                          Linking.openURL(
                            "https://www.unicesmag.edu.co/documentos/DATOS-UNICESMAG.pdf"
                          )
                        }
                      >
                        política de datos personales
                      </Text>{" "}
                      de UNICESMAG.
                    </Text>
                  </View>
                </View>

                {termsError && (
                  <View style={styles.termsErrorRow}>
                    <MaterialCommunityIcons
                      name="alert-circle-outline"
                      size={14}
                      color={Colors.secondary}
                    />
                    <Text style={styles.termsErrorText}>
                      Debes aceptar los términos y condiciones para continuar
                    </Text>
                  </View>
                )}

                <Button
                  isLoading={isLoading}
                  onPress={handleSubmit((data) => {
                    if (!acceptedTerms) {
                      setTermsError(true);
                      return;
                    }
                    setTermsError(false);
                    setError(null);
                    setIsLoading(true);
                    Keyboard.dismiss();

                    mutation.mutate(
                      { ...data, username: data.email },
                      {
                        onSuccess: (data) => {
                          setAuth({
                            token: data.jwt,
                            authenticated: true,
                            user: data.user,
                          });
                        },
                        onError: (error) => {
                          if (error.status === 400) {
                            setError(
                              "Este correo electrónico ya se encuentra registrado"
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
                      }
                    );
                  })}
                  title="REGISTRARME AHORA"
                />
              </View>

              {/* FOOTER LINK */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
                <Pressable onPress={() => router.back()}>
                  <Text style={styles.loginLink}>Inicia sesión aquí</Text>
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
  termsBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 4,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  checkbox: {
    marginTop: 2,
    borderRadius: 4,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#475569",
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  termsErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: -8,
  },
  termsErrorText: {
    color: Colors.secondary,
    fontSize: 12,
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
  loginLink: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});
