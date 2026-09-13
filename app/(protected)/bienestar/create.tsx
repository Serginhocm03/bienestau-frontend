import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, Platform, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm } from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/bienestar/colors";
import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";
import { Text } from "@/components/bienestar/primitives/Text";
import { TextInputController } from "@/components/bienestar/from/TextInput";
import { Button } from "@/components/bienestar/from/Button";
import { DropdownController } from "@/components/bienestar/from/Dropdown";
import { env } from "@/lib/bienestar/env";
import { useAuth } from "@/context/auth/AuthContext";
import { buildUrl } from "@/lib/bienestar/api";
import { useQueryClient } from "@tanstack/react-query";

type FormData = {
  type: "event" | "news";
  title: string;
  description: string;
  date: Date;
};

export default function CreateContent() {
  const router = useRouter();
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
  const [image, setImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1.5); // Default to a standard ratio
  const [uploading, setUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Determinar la imagen a mostrar (la seleccionada o la que ya tenía)
  const displayImage = image || (initialImageUrl ? buildUrl(initialImageUrl, true) : null);

  const isEditing = !!id;

  // EFECTO: Obtener aspect ratio de la imagen inicial si existe
  useEffect(() => {
    if (initialImageUrl) {
      const url = buildUrl(initialImageUrl, true);
      Image.getSize(url, (width, height) => {
        setAspectRatio(width / height);
      }, (error) => console.error("Error al obtener tamaño de imagen inicial:", error));
    }
  }, [initialImageUrl]);

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

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          "Permiso Necesario",
          "Ve a los ajustes de tu celular y permite el acceso a las fotos para poder subir imágenes."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.6,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setImage(asset.uri);
        if (asset.width && asset.height) {
          setAspectRatio(asset.width / asset.height);
        }
      }
    } catch (error: any) {
      console.error("❌ ERROR GALERÍA:", error);
      Alert.alert("Error de Sistema", `No se pudo abrir la galería. Detalle: ${error.message}`);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!image && !isEditing) {
      Alert.alert("Falta Imagen", "Selecciona una imagen de tu galería para poder publicar.");
      return;
    }

    setUploading(true);
    try {
      let imageId = null;

      if (image) {
        const formData = new FormData();
        const uri = image;

        // Extraer nombre de archivo y tipo de forma segura
        const filename = uri.split('/').pop() || 'upload.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        // En Android, a veces el URI necesita ser procesado
        const fileToUpload = {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          name: filename,
          type: type,
        };

        formData.append('files', fileToUpload as any);

        console.log("🚀 Iniciando subida de imagen...");
        const response = await fetch(`${env.API}/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            // NOTA: NO poner Content-Type manual para FormData, el sistema lo hace solo
          },
        });

        const uploadData = await response.json();

        if (response.ok && Array.isArray(uploadData) && uploadData[0]) {
          imageId = uploadData[0].id;
          console.log("✅ Imagen subida exitosamente. ID:", imageId);
        } else {
          console.error("❌ Error en servidor Strapi al subir:", uploadData);
          throw new Error(uploadData?.error?.message || "No se pudo procesar la imagen en el servidor.");
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
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.mainTitle}>{isEditing ? "ACTUALIZAR" : "CREAR PUBLICACIÓN"}</Text>

        <View style={styles.group}>
          <Text style={styles.label}>CATEGORÍA</Text>
          <DropdownController name="type" control={control} errors={errors} data={[{ label: "Noticia", value: "news" }, { label: "Evento", value: "event" }]} />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>TÍTULO</Text>
          <TextInputController name="title" control={control} errors={errors} rules={{ required: "Obligatorio" }} inputProps={{ placeholder: "Escribe aquí..." }} />
        </View>

        {contentType === "event" && (
          <View style={styles.group}>
            <Text style={styles.label}>FECHA</Text>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.rowBtn}>
              <Image
                source={require("@/assets/images/biñetas.png")}
                style={{ width: 20, height: 20, tintColor: Colors.primary }}
                resizeMode="contain"
              />
              <Text>{eventDate.toLocaleDateString()}</Text>
            </Pressable>
            {showDatePicker && <DateTimePicker value={eventDate} mode="date" onChange={(e, d) => { setShowDatePicker(false); if (d) setValue("date", d); }} />}
          </View>
        )}

        <View style={styles.group}>
          <Text style={styles.label}>DESCRIPCIÓN</Text>
          <TextInputController name="description" control={control} errors={errors} rules={{ required: "Obligatorio" }} inputProps={{ placeholder: "Detalles...", multiline: true, numberOfLines: 5, style: styles.area }} />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>FOTO DE GALERÍA</Text>
          <Pressable onPress={pickImage} style={styles.imageBtn}>
            <Image
              source={require("@/assets/images/Crear.png")}
              style={{ width: 35, height: 35, tintColor: image ? Colors.primary : "#94A3B8" }}
              resizeMode="contain"
            />
            <Text style={{ fontWeight: 'bold', color: image ? Colors.primary : "#94A3B8" }}>
              {image ? "FOTO CAMBIADA" : (initialImageUrl ? "CAMBIAR FOTO" : "ABRIR GALERÍA")}
            </Text>
          </Pressable>
          {displayImage && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: displayImage }}
                style={styles.blurBackground}
                blurRadius={20}
              />
              <Image
                source={{ uri: displayImage }}
                style={styles.preview}
                resizeMode="contain"
              />
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
  container: { padding: 25, paddingBottom: 50 },
  mainTitle: { fontSize: 24, fontWeight: '900', color: Colors.primary, textAlign: 'center', marginBottom: 30 },
  group: { marginBottom: 25 },
  label: { fontSize: 12, fontWeight: '900', color: '#64748B', marginBottom: 10, letterSpacing: 1 },
  rowBtn: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#F1F5F9', borderRadius: 12, gap: 10 },
  area: { height: 120, textAlignVertical: 'top', borderRadius: 12 },
  imageBtn: { height: 100, borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1', borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#F8FAFC' },
  previewContainer: { marginTop: 15, height: 220, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: '#E2E8F0', position: 'relative' },
  blurBackground: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
  preview: { width: '100%', height: '100%' },
  footer: { marginTop: 20 }
});
