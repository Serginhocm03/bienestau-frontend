import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/auth/AuthContext";
import { postApi } from "@/lib/bienestar/api";
import { TextInputController } from "@/components/bienestar/from/TextInput";
import { useForm } from "react-hook-form";

import { AxiosError } from "axios";
import { Button } from "@/components/bienestar/from/Button";
import { Text } from "@/components/bienestar/primitives/Text";
import {
  AuthLocalRequest,
  AuthLocalResponse,
  ErrorResponse,
} from "@/types/bienestar/dto";

export default function Login() {
  const { setAuth } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthLocalRequest>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    AuthLocalResponse,
    AxiosError<ErrorResponse>,
    AuthLocalRequest
  >({
    mutationFn: postApi("auth/local"),
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={require("@/assets/images/icon.png")}
              style={{
                width: 250,
                height: 250,
                marginBottom: 16,
              }}
            />

            <View style={{ width: "100%", maxWidth: 400 }}>
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Text type="title">Iniciar sesión</Text>
              </View>

              {error && (
                <View style={{ marginBottom: 16 }}>
                  <Text color="secondary">{error}</Text>
                </View>
              )}

              <View style={{ gap: 16 }}>
                <TextInputController
                  name="identifier"
                  control={control}
                  errors={errors}
                  inputProps={{
                    autoCapitalize: "none",
                    placeholder: "Correo electrónico",
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
                        "El correo electrónico debe ser un correo institucional",
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
                    secureTextEntry: true,
                  }}
                  rules={{
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  }}
                />

                <Button
                  isLoading={isLoading}
                  onPress={handleSubmit((data) => {
                    setIsLoading(true);
                    Keyboard.dismiss();

                    mutation.mutate(data, {
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
                            "Correo electrónico o contraseña incorrectos"
                          );
                        } else {
                          setError(
                            "Error del servidor, por favor intente mas tarde"
                          );
                        }
                      },
                      onSettled: () => {
                        setIsLoading(false);
                      },
                    });
                  })}
                  title="Iniciar sesión"
                />

                <Button
                  link={{
                    href: "/(auth)/register",
                  }}
                  type="text"
                  title="Registrarse"
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}