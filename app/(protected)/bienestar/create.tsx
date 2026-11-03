import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, Platform, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm } from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/bienestar/colors";
import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";
import { Text } from "@/components/bienestar/primitives/Text";
import { TextInputController } from "@/components/bienestar/from/TextInput";
import { Button } from "@/components/bienestar/from/Button";
import { DropdownController } from "@/components/bienestar/from/Dropdown";
import { env } from "@/lib/bienestar/env";
import { useAuth } from "@/context/auth/AuthContext";
import { buildUrl, isVideoMedia } from "@/lib/bienestar/api";
import { useQueryClient } from "@tanstack/react-query";

type FormData = {
  type: "event" | "news";
  title: string;
  description: string;
  date: Date;
};

const MAX_TITLE_LENGTH = 100;
const MAX_DESC_LENGTH = 1000;

export default function CreateContent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, type, initialTitle, initialDescription, initialDate, initialImageUrl } = useLocalSearchParams<{
    id?: string,
    type?: "event" | "news",
    initialTitle?: string,
    initialDescription?: string,
    initialDate?: string,
    initialImageUrl?: string
  }>();

  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const displayMedia = mediaUri || (initialImageUrl ? buildUrl(initialImageUrl, true) : null);
  const displayIsVideo = mediaUri ? isVideo : isVideoMedia(initialImageUrl);

  const isEditing = !!id;

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      type: type || "news",
      title: initialTitle || "",
      description: initialDescription || "",
      date: initialDate ? new Date(initialDate) : new Date(),
    }
  });

  const eventDate = watch("date");
  const contentType = watch("type");
  const watchTitle = watch("title") || "";
  const watchDescription = watch("description") || "";

  const pickMedia = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          "Permiso Necesario",
          "Ve a los ajustes de tu celular y permite el acceso a las fotos y videos para poder subir archivos multimedia."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: false,
        quality: 0.6,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setMediaUri(asset.uri);

        const isVideoAsset = asset.type === 'video' || isVideoMedia(asset.uri);
        setIsVideo(isVideoAsset);
      }
    } catch (error: any) {
      console.error("❌ ERROR GALERÍA:", error);
      Alert.alert("Error de Sistema", `No se pudo abrir la galería. Detalle: ${error.message}`);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!mediaUri && !isEditing) {
      Alert.alert("Falta Archivo", "Selecciona una imagen o video de tu galería para poder publicar.");
      return;
    }

    setUploading(true);
    try {
      let imageId = null;

      if (mediaUri) {
        const formData = new FormData();
        const uri = mediaUri;

        const filename = uri.split('/').pop() || (isVideo ? 'upload.mp4' : 'upload.jpg');
        const ext = filename.split('.').pop()?.toLowerCase() || '';

        let mimeType = isVideo ? 'video/mp4' : 'image/jpeg';
        if (['mp4', 'mov', 'avi', 'm4v', 'webm', 'mkv', '3gp'].includes(ext)) {
          mimeType = `video/${ext === 'mov' ? 'quicktime' : ext}`;
        } else if (['png', 'webp', 'gif'].includes(ext)) {
          mimeType = `image/${ext}`;
        }

        const fileToUpload = {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          name: filename,
          type: mimeType,
        };

        formData.append('files', fileToUpload as any);

        console.log("🚀 Iniciando subida multimedia...");
        const response = await fetch(`${env.API}/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });

        const uploadData = await response.json();

        if (response.ok && Array.isArray(uploadData) && uploadData[0]) {
          imageId = uploadData[0].id;
          console.log("✅ Archivo subido exitosamente. ID:", imageId);
        } else {
          console.error("❌ Error en servidor Strapi al subir:", uploadData);
          throw new Error(uploadData?.error?.message || "No se pudo procesar el archivo multimedia en el servidor.");
        }
      }

      const endpoint = data.type === "event" ? "events" : "news";
      const payload = {
        data: {
          title: data.title,
          description: data.description,
          publishedAt: new Date().toISOString(),
          ...(data.type === "event" ? { fecha_evento: data.date.toISOString().split('T')[0] } : {}),
          ...(imageId ? { image: imageId } : {}),
        }
      };

      const saveResponse = await fetch(isEditing ? buildUrl(`${endpoint}/${id}`, false) : buildUrl(endpoint, false), {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (saveResponse.ok) {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        queryClient.invalidateQueries({ queryKey: ["news"] });
        queryClient.invalidateQueries({ queryKey: ["reminders"] });
        Alert.alert("¡Éxito!", "Publicado correctamente.");
        router.back();
      } else {
        const errorData = await saveResponse.json();
        console.error("❌ Fallo al guardar datos:", errorData);
        throw new Error("No se pudo guardar la información.");
      }
    } catch (error: any) {
      console.error("❌ Error Final:", error);
      Alert.alert("Error de Publicación", error.message || "Revisa tu conexión a internet e intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollViewLayout
      header={{ title: isEditing ? "EDITAR" : "NUEVO" }}
      layout={{ height: 0, minHeight: 0 }}
      onBack={() => router.back()}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: Math.max(50, insets.bottom + 30) }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.mainTitle}>{isEditing ? "ACTUALIZAR" : "CREAR PUBLICACIÓN"}</Text>

        <View style={styles.group}>
          <Text style={styles.label}>CATEGORÍA</Text>
          <DropdownController name="type" control={control} errors={errors} data={[{ label: "Noticia", value: "news" }, { label: "Evento", value: "event" }]} />
        </View>

        <View style={styles.group}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>TÍTULO</Text>
            <Text style={[styles.counterText, watchTitle.length >= MAX_TITLE_LENGTH && styles.limitText]}>
              {watchTitle.length} / {MAX_TITLE_LENGTH}
            </Text>
          </View>
          <TextInputController
            name="title"
            control={control}
            errors={errors}
            rules={{
              required: "El título es obligatorio",
              maxLength: { value: MAX_TITLE_LENGTH, message: `El título no puede superar los ${MAX_TITLE_LENGTH} caracteres` }
            }}
            inputProps={{ placeholder: "Escribe un título claro...", maxLength: MAX_TITLE_LENGTH }}
          />
        </View>

        {contentType === "event" && (
          <View style={styles.group}>
            <Text style={styles.label}>FECHA DEL EVENTO</Text>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.rowBtn}>
              <Image
                source={require("@/assets/images/biñetas.png")}
                style={{ width: 20, height: 20, tintColor: Colors.primary }}
                resizeMode="contain"
              />
              <Text style={{ fontWeight: '700', color: Colors.primary }}>{eventDate.toLocaleDateString()}</Text>
            </Pressable>
            {showDatePicker && <DateTimePicker value={eventDate} mode="date" onChange={(e, d) => { setShowDatePicker(false); if (d) setValue("date", d); }} />}
          </View>
        )}

        <View style={styles.group}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>DESCRIPCIÓN</Text>
            <Text style={[styles.counterText, watchDescription.length >= MAX_DESC_LENGTH && styles.limitText]}>
              {watchDescription.length} / {MAX_DESC_LENGTH} caracteres
            </Text>
          </View>
          <TextInputController
            name="description"
            control={control}
            errors={errors}
            rules={{
              required: "La descripción es obligatoria",
              maxLength: { value: MAX_DESC_LENGTH, message: `La descripción no puede superar los ${MAX_DESC_LENGTH} caracteres` }
            }}
            inputProps={{
              placeholder: "Detalles del contenido (máx 1000 caracteres)...",
              multiline: true,
              numberOfLines: 5,
              maxLength: MAX_DESC_LENGTH,
              style: styles.area
            }}
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>IMAGEN O VIDEO DE GALERÍA</Text>
          <Pressable onPress={pickMedia} style={styles.imageBtn}>
            <MaterialCommunityIcons
              name={displayIsVideo ? "video-vintage" : "image-plus"}
              size={36}
              color={mediaUri ? Colors.primary : "#94A3B8"}
            />
            <Text style={{ fontWeight: 'bold', color: mediaUri ? Colors.primary : "#94A3B8", textAlign: 'center' }}>
              {mediaUri
                ? (isVideo ? "VIDEO CAMBIADO" : "IMAGEN CAMBIADA")
                : (initialImageUrl ? "CAMBIAR FOTO / VIDEO" : "SELECCIONAR FOTO O VIDEO")}
            </Text>
          </Pressable>
          {displayMedia && (
            <View style={styles.previewContainer}>
              {!displayIsVideo ? (
                <>
                  <Image
                    source={{ uri: displayMedia }}
                    style={styles.blurBackground}
                    blurRadius={20}
                  />
                  <Image
                    source={{ uri: displayMedia }}
                    style={styles.preview}
                    resizeMode="contain"
                  />
                </>
              ) : (
                <View style={styles.videoBadgePreview}>
                  <MaterialCommunityIcons name="play-circle-outline" size={54} color="white" />
                  <Text style={styles.videoBadgeText}>VIDEO LISTO PARA PUBLICAR</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {uploading ? <ActivityIndicator size="large" color={Colors.secondary} /> :
          <Button title="PUBLICAR AHORA" onPress={handleSubmit(onSubmit)} color="secondary" />}
        </View>
      </ScrollView>
    </ScrollViewLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25 },
  mainTitle: { fontSize: 24, fontWeight: '900', color: Colors.primary, textAlign: 'center', marginBottom: 30 },
  group: { marginBottom: 25 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '900', color: '#64748B', letterSpacing: 1 },
  counterText: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },
  limitText: { color: Colors.secondary },
  rowBtn: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#F1F5F9', borderRadius: 12, gap: 10 },
  area: { height: 130, textAlignVertical: 'top', borderRadius: 12 },
  imageBtn: { height: 110, borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1', borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#F8FAFC', paddingHorizontal: 15 },
  previewContainer: { marginTop: 15, height: 220, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: '#E2E8F0', position: 'relative' },
  blurBackground: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
  preview: { width: '100%', height: '100%' },
  videoBadgePreview: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: '#0F172A' },
  videoBadgeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 13, letterSpacing: 1 },
  footer: { marginTop: 20 }
});
