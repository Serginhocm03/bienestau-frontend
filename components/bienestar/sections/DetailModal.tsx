import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  StyleSheet,
  Image as RNImage,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/bienestar/primitives/Text";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { Colors } from "@/constants/bienestar/colors";
import { Media } from "@/types/bienestar/primitives";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { scheduleEventReminder12HoursBefore } from "@/lib/bienestar/notifications";

export interface DetailModalProps {
  visible: boolean;
  onClose: () => void;
  item: {
    id: number;
    documentId?: string;
    title: string;
    description?: string;
    image?: Media;
    url?: string;
    date?: string;
    fecha_evento?: string;
  } | null;
  isManager?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DetailModal({
  visible,
  onClose,
  item,
  isManager = false,
  onEdit,
  onDelete,
}: DetailModalProps) {
  const { width } = useWindowDimensions();
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const scrollRef = useRef<ScrollView>(null);

  const resetScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: false });
    }
  };

  useEffect(() => {
    if (visible) {
      resetScroll();
      const timer = setTimeout(() => {
        resetScroll();
      }, 50);
      return () => clearTimeout(timer);
    }

    if (item && (item.image?.url || item.url)) {
      const url = buildMediaUrl(item.image?.url || item.url);
      RNImage.getSize(
        url,
        (w, h) => {
          setAspectRatio(w / h);
        },
        () => setAspectRatio(1)
      );
    }
  }, [visible, item]);

  if (!item) return null;

  // Normalizar item para soportar objetos planos o anidados dentro de "attributes" (Strapi API v4/v5)
  const title = item.title || (item as any).attributes?.title || "Sin título";
  const description = item.description || (item as any).attributes?.description || "";
  const rawImage = item.image || (item as any).attributes?.image || item.url || (item as any).attributes?.url;

  // Extraer URL de la imagen de forma segura
  let imageUrl: string | null = null;
  if (rawImage) {
    if (typeof rawImage === 'string') {
      imageUrl = buildMediaUrl(rawImage);
    } else if (rawImage.url) {
      imageUrl = buildMediaUrl(rawImage.url);
    } else if (rawImage.data?.attributes?.url) {
      imageUrl = buildMediaUrl(rawImage.data.attributes.url);
    } else if (rawImage.data?.url) {
      imageUrl = buildMediaUrl(rawImage.data.url);
    }
  }

  const displayDate = item.date || item.fecha_evento || (item as any).attributes?.fecha_evento || (item as any).attributes?.date;

  const handleScheduleReminder = async () => {
    if (!item) return;
    const scheduled = await scheduleEventReminder12HoursBefore({ ...item, title, fecha_evento: displayDate });
    if (scheduled) {
      Alert.alert(
        "¡Recordatorio Programado!",
        `Recibirás una notificación en tu dispositivo 12 horas antes del evento "${title}".`
      );
    } else {
      Alert.alert(
        "Aviso de Recordatorio",
        "La fecha de este evento ya transcurrió o falta menos de 12 horas para su inicio."
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      onShow={resetScroll}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        {/* VENTANA EMERGENTE CENTRADA Y PROFESIONAL */}
        <View style={styles.dialogCard}>
          {/* 1. ENCABEZADO DEL DIÁLOGO */}
          <View style={styles.dialogHeader}>
            <View style={styles.categoryBadge}>
              <MaterialCommunityIcons
                name={displayDate ? "calendar-star" : "newspaper-variant-outline"}
                size={14}
                color={Colors.primary}
              />
              <Text style={styles.categoryBadgeText}>
                {displayDate ? "EVENTO" : "NOTICIA"}
              </Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeBtnCircle}>
              <MaterialCommunityIcons name="close" size={20} color={Colors.primary} />
            </Pressable>
          </View>

          {/* 2. ÁREA DE CONTENIDO DESLIZANTE */}
          <ScrollView
            ref={scrollRef}
            style={styles.scrollBody}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
            contentContainerStyle={styles.scrollContent}
            bounces={true}
            overScrollMode="always"
          >
            {imageUrl && (
              <View style={styles.imageCard}>
                <RNImage
                  source={{ uri: imageUrl }}
                  style={styles.blurBackground}
                  blurRadius={15}
                />
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  contentFit="cover"
                  transition={200}
                />
              </View>
            )}

            <Text style={styles.titleText}>{title}</Text>

            {displayDate && (
              <View style={styles.dateRow}>
                <View style={styles.dateBadge}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={15}
                    color={Colors.secondary}
                  />
                  <Text style={styles.dateText}>Fecha: {displayDate}</Text>
                </View>

                <Pressable style={styles.reminderBtn} onPress={handleScheduleReminder}>
                  <MaterialCommunityIcons
                    name="bell-ring-outline"
                    size={14}
                    color="white"
                  />
                  <Text style={styles.reminderBtnText}>Recordarme (12h antes)</Text>
                </Pressable>
              </View>
            )}

            <View style={styles.divider} />

            {description ? (
              <Text style={styles.descriptionText} selectable={true}>
                {description}
              </Text>
            ) : (
              <Text style={[styles.descriptionText, { italic: true, color: "#94A3B8" }]}>
                Sin descripción disponible.
              </Text>
            )}
          </ScrollView>

          {/* 3. BARRA DE ACCIONES ADMINISTRATIVAS EN EL PIE DE LA VENTANA */}
          {isManager && (
            <View style={styles.dialogFooter}>
              <Pressable
                onPress={onEdit}
                style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
              >
                <MaterialCommunityIcons name="pencil" size={18} color="white" />
                <Text style={styles.actionBtnText}>Editar</Text>
              </Pressable>

              <Pressable
                onPress={onDelete}
                style={[styles.actionBtn, { backgroundColor: Colors.secondary }]}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={18} color="white" />
                <Text style={styles.actionBtnText}>Eliminar</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  dialogCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: "100%",
    maxWidth: 440,
    maxHeight: "88%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
    display: "flex",
    flexDirection: "column",
  },
  dialogHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  closeBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollBody: {
    flexShrink: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 30,
  },
  imageCard: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000000",
    marginBottom: 16,
    position: "relative",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  titleText: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  reminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reminderBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  divider: {
    height: 3,
    width: 36,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
    marginBottom: 14,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#334155",
    textAlign: "left",
  },
  dialogFooter: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
