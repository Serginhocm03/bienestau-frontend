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
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/bienestar/primitives/Text";
import { Button } from "@/components/bienestar/from/Button";
import { TextInputController } from "@/components/bienestar/from/TextInput";
import { useAuth } from "@/context/auth/AuthContext";
import { Colors } from "@/constants/bienestar/colors";
import { env } from "@/lib/bienestar/env";
import { buildMediaUrl, buildUrl } from "@/lib/bienestar/api";

type ChangePasswordFormData = {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};

type EditProfileFormData = {
  name: string;
};

export default function Profile() {
  const { auth, setAuth, user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Formulario para Cambiar Contraseña
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  // Formulario para Editar Nombre
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<EditProfileFormData>({
    defaultValues: {
      name: user?.name || "",
    },
  });

  const newPasswordValue = watchPassword("password");

  const avatarUrl = user?.avatar?.url ? buildMediaUrl(user.avatar.url) : null;

  const handleLogout = async () => {
    try {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        await SecureStore.deleteItemAsync(env.TOKEN_KEY);
        await SecureStore.deleteItemAsync("bienestau_user_data");
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

  // Función para Cambiar Foto de Perfil
  const pickAndUploadAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permiso Necesario",
          "Ve a los ajustes de tu celular y permite el acceso a las fotos para actualizar tu foto de perfil."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        setUploadingAvatar(true);

        const formData = new FormData();
        const filename = uri.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('files', {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          name: filename,
          type: type,
        } as any);

        console.log("🚀 Subiendo nueva foto de perfil...");
        const response = await fetch(`${env.API}/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });

        const uploadData = await response.json();

        if (response.ok && Array.isArray(uploadData) && uploadData[0]) {
          const imageId = uploadData[0].id;
          console.log("✅ Imagen subida. Actualizando usuario con avatar ID:", imageId);

          // Actualizar campo avatar del usuario en Strapi
          const updateRes = await axios.put(
            buildUrl("users/me", false),
            { avatar: imageId },
            { headers: { Authorization: `Bearer ${auth.token}` } }
          );

          if (updateRes.data) {
            const updatedUser = { ...auth.user, avatar: uploadData[0] };
            setAuth({ ...auth, user: updatedUser as any });
            if (Platform.OS === "android" || Platform.OS === "ios") {
              await SecureStore.setItemAsync("bienestau_user_data", JSON.stringify(updatedUser));
            }
            Alert.alert("¡Éxito!", "Tu foto de perfil ha sido actualizada.");
          }
        } else {
          throw new Error("No se pudo subir la foto de perfil.");
        }
      }
    } catch (error: any) {
      console.error("❌ Error subiendo avatar:", error);
      Alert.alert("Error", error.message || "No se pudo cambiar la foto de perfil.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Función para Editar Nombre
  const onUpdateProfile = async (data: EditProfileFormData) => {
    setIsLoadingProfile(true);
    setProfileErrorMsg(null);
    setProfileSuccessMsg(null);
    Keyboard.dismiss();

    try {
      console.log("🔄 Actualizando nombre de usuario...");
      const response = await axios.put(
        buildUrl("users/me", false),
        { name: data.name },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      console.log("✅ Nombre de usuario actualizado");
      setProfileSuccessMsg("¡Nombre de usuario actualizado correctamente!");

      const updatedUser = { ...auth.user, name: data.name };
      setAuth({ ...auth, user: updatedUser as any });
      if (Platform.OS === "android" || Platform.OS === "ios") {
        await SecureStore.setItemAsync("bienestau_user_data", JSON.stringify(updatedUser));
      }

      Alert.alert("¡Éxito!", "Tu nombre ha sido actualizado correctamente.");
    } catch (error: any) {
      console.error("❌ Error al actualizar perfil:", error?.response?.data || error.message);
      setProfileErrorMsg("No se pudo actualizar el nombre. Intenta de nuevo.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Función para Cambiar Contraseña
  const onChangePassword = async (data: ChangePasswordFormData) => {
    setIsLoadingPassword(true);
    setPasswordErrorMsg(null);
    setPasswordSuccessMsg(null);
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
      setPasswordSuccessMsg("¡Contraseña actualizada correctamente!");
      resetPasswordForm();

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
        setPasswordErrorMsg("La contraseña actual no es correcta.");
      } else {
        setPasswordErrorMsg(serverError || "No se pudo cambiar la contraseña. Intenta nuevamente.");
      }
    } finally {
      setIsLoadingPassword(false);
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
      {/* 1. ENCABEZADO Y AVATAR CON BOTÓN DE CÁMARA */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          {avatarUrl ? (
            <ExpoImage
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <ExpoImage
              source={require("@/assets/images/Perfil.png")}
              style={styles.avatarImage}
              tintColor={Colors.primary}
              contentFit="contain"
            />
          )}

          <Pressable onPress={pickAndUploadAvatar} style={styles.cameraBadgeBtn}>
            {uploadingAvatar ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialCommunityIcons name="camera" size={18} color="white" />
            )}
          </Pressable>
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

      {/* 3. SECCIÓN EDITAR DATOS DE PERFIL (NOMBRE) */}
      <View style={styles.card}>
        <Pressable
          onPress={() => setShowProfileForm(!showProfileForm)}
          style={styles.cardToggleHeader}
        >
          <View style={styles.cardTitleRow}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={22}
              color={Colors.primary}
            />
            <Text type="defaultBold" color="primary" style={{ fontSize: 16 }}>
              Editar Datos del Perfil
            </Text>
          </View>
          <MaterialCommunityIcons
            name={showProfileForm ? "chevron-up" : "chevron-down"}
            size={24}
            color="#64748B"
          />
        </Pressable>

        {showProfileForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formInstructions}>
              Actualiza tu nombre completo para mostrarlo en tu cuenta.
            </Text>

            {profileSuccessMsg && (
              <View style={styles.successBanner}>
                <MaterialCommunityIcons name="check-circle" size={18} color="#16A34A" />
                <Text style={styles.successText}>{profileSuccessMsg}</Text>
              </View>
            )}

            {profileErrorMsg && (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons name="alert-circle" size={18} color={Colors.secondary} />
                <Text style={styles.errorText}>{profileErrorMsg}</Text>
              </View>
            )}

            <View style={styles.fieldGap}>
              <View>
                <Text style={styles.fieldLabel}>NOMBRE COMPLETO</Text>
                <TextInputController
                  name="name"
                  control={profileControl}
                  errors={profileErrors}
                  rules={{
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 6,
                      message: "El nombre debe tener al menos 6 caracteres",
                    },
                  }}
                  inputProps={{
                    placeholder: "Tu nombre completo",
                    leftIcon: "account-outline",
                  }}
                />
              </View>

              <View style={{ marginTop: 8 }}>
                {isLoadingProfile ? (
                  <ActivityIndicator size="large" color={Colors.secondary} />
                ) : (
                  <Button
                    title="GUARDAR NOMBRE"
                    onPress={handleProfileSubmit(onUpdateProfile)}
                    color="primary"
                  />
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 4. SECCIÓN DE CAMBIO DE CONTRASEÑA */}
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

            {passwordSuccessMsg && (
              <View style={styles.successBanner}>
                <MaterialCommunityIcons name="check-circle" size={18} color="#16A34A" />
                <Text style={styles.successText}>{passwordSuccessMsg}</Text>
              </View>
            )}

            {passwordErrorMsg && (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons name="alert-circle" size={18} color={Colors.secondary} />
                <Text style={styles.errorText}>{passwordErrorMsg}</Text>
              </View>
            )}

            <View style={styles.fieldGap}>
              <View>
                <Text style={styles.fieldLabel}>CONTRASEÑA ACTUAL</Text>
                <TextInputController
                  name="currentPassword"
                  control={passwordControl}
                  errors={passwordErrors}
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
                  control={passwordControl}
                  errors={passwordErrors}
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
                  control={passwordControl}
                  errors={passwordErrors}
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
                {isLoadingPassword ? (
                  <ActivityIndicator size="large" color={Colors.secondary} />
                ) : (
                  <Button
                    title="ACTUALIZAR CONTRASEÑA"
                    onPress={handlePasswordSubmit(onChangePassword)}
                    color="secondary"
                  />
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 5. BOTÓN CERRAR SESIÓN */}
      <View style={styles.logoutContainer}>
        <Button
          title="CERRAR SESIÓN"
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
    marginBottom: 24,
    marginTop: 10,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 14,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  cameraBadgeBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.secondary,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    marginBottom: 18,
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
    marginTop: 10,
  },
});

