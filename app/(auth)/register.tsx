import { Colors } from "@/constants/bienestar/colors";
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
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";

import Checkbox from 'expo-checkbox';
import { Linking } from 'react-native';

import { useAuth } from "@/context/auth/AuthContext";
import { postApi } from "@/lib/bienestar/api";
import { TextInputController } from "@/components/bienestar/from/TextInput";
import { Button } from "@/components/bienestar/from/Button";
import { Text } from "@/components/bienestar/primitives/Text";
import { DropdownController } from "@/components/bienestar/from/Dropdown";
import {
  AuthLocalRegisterRequest,
  AuthLocalRegisterResponse,
} from "@/types/bienestar/dto";

export default function Register() {
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

  const { auth, setAuth } = useAuth();

  const mutation = useMutation<
    AuthLocalRegisterResponse,
    AxiosError,
    AuthLocalRegisterRequest
  >({
    mutationFn: postApi("auth/local/register"),
  });

  const router = useRouter();

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
                <Text type="title">Registrarse</Text>
              </View>

              {error && (
                <View style={{ marginBottom: 16 }}>
                  <Text color="secondary">{error}</Text>
                </View>
              )}

              <View style={{ gap: 16 }}>
                <TextInputController
                  name="name"
                  control={control}
                  errors={errors}
                  inputProps={{
                    placeholder: "Nombre",
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

                {/* El selector de tipo de usuario ha sido eliminado por seguridad.
                    Por defecto todos se registran como estudiantes. */}

                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <Checkbox
                  value={acceptedTerms}
                  onValueChange={setAcceptedTerms}
                  color={acceptedTerms ? Colors.primary : undefined}
                  style={{ marginTop: 2 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, lineHeight: 20 }}>
                      Acepto los{' '}
                      <Text
                      style={{ color: Colors.primary, textDecorationLine: 'underline' }}
                      onPress={() => Linking.openURL('https://www.unicesmag.edu.co/documentos/DATOS-UNICESMAG.pdf')}
                      >
                        términos y condiciones
                      </Text>
                      {' '}y la{' '}
                      <Text
                      style={{ color: Colors.primary, textDecorationLine: 'underline' }}
                      onPress={() => Linking.openURL('https://www.unicesmag.edu.co/documentos/DATOS-UNICESMAG.pdf')}
                      >
                        política de tratamiento de datos personales
                      </Text>
                      {' '}de UNICESMAG
                    </Text>
                  </View>
                </View>
                {termsError && (
                  <Text style={{ color: '#D91F5E', fontSize: 12, marginTop: 4 }}>
                    Debes aceptar los términos y condiciones para continuar
                  </Text>
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
                              "Correo electrónico o nombre de usuario ya registrado"
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
                      }
                    );
                  })}
                  title="Registrarse"
                />
                <Button
                  type="text"
                  title="Atrás"
                  onPress={() => {
                    router.back();
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}