import React, { useState, useEffect } from "react";
import { Modal, View, ScrollView, Pressable, useWindowDimensions, StyleSheet, Image as RNImage } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/bienestar/primitives/Text";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { Colors } from "@/constants/bienestar/colors";
import { Media } from "@/types/bienestar/primitives";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

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
  } | null;
  isManager?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DetailModal({ visible, onClose, item, isManager = false, onEdit, onDelete }: DetailModalProps) {
  const { width } = useWindowDimensions();
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  useEffect(() => {
    if (item && (item.image?.url || item.url)) {
      const url = buildMediaUrl(item.image?.url || item.url);
      RNImage.getSize(url, (w, h) => {
        setAspectRatio(w / h);
      }, () => setAspectRatio(1));
    }
  }, [item]);

  if (!item) return null;

  const imageUrl = item.image ? buildMediaUrl(item.image.url) : (item.url ? buildMediaUrl(item.url) : null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {imageUrl && (
              <View style={styles.imageContainer}>
                <RNImage
                  source={{ uri: imageUrl }}
                  style={styles.blurBackground}
                  blurRadius={15}
                />
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  contentFit="contain"
                  transition={200}
                />
              </View>
            )}

            <View style={styles.textContainer}>
              <Text type="subtitle" color="primary" style={styles.title}>
                {item.title}
              </Text>

              {item.date && (
                <View style={styles.dateBadge}>
                  <Image
                    source={require("@/assets/images/biñetas.png")}
                    style={{ width: 16, height: 16, tintColor: Colors.secondary }}
                    resizeMode="contain"
                  />
                  <Text style={styles.dateText}>Evento: {item.date}</Text>
                </View>
              )}

              <View style={styles.divider} />
              <Text style={styles.description}>
                {item.description}
              </Text>
            </View>
          </ScrollView>

          {/* Botón de cierre superior premium */}
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <BlurView intensity={80} style={styles.blurClose}>
              <Image
                source={require("@/assets/images/cerrar.png")}
                style={{ width: 24, height: 24, tintColor: Colors.primary }}
                resizeMode="contain"
              />
            </BlurView>
          </Pressable>

          {/* Barra de administración profesional */}
          {isManager && (
            <View style={styles.adminBar}>
              <Pressable
                onPress={onEdit}
                style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
              >
                <MaterialCommunityIcons name="pencil" size={20} color="white" />
                <Text style={styles.actionText}>Editar</Text>
              </Pressable>

              <Pressable
                onPress={onDelete}
                style={[styles.actionBtn, { backgroundColor: Colors.secondary }]}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="white" />
                <Text style={styles.actionText}>Eliminar</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

function LinearGradientOverlay() {
    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: 'transparent',
            // Simulación de degradado para suavizar la transición a blanco
        }} />
    )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "92%",
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
    position: 'relative',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    marginBottom: 16,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  divider: {
    height: 4,
    width: 40,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
    marginBottom: 20,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    color: "#334155",
    textAlign: "justify",
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  blurClose: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  adminBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 34,
    backgroundColor: "white",
    flexDirection: "row",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  actionBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  }
});
