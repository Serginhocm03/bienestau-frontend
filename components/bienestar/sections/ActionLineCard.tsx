import React from "react";
import { View, Image, StyleSheet, Pressable, ViewStyle } from "react-native";
import { Text } from "@/components/bienestar/primitives/Text";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { ActionLine } from "@/types/bienestar/collections";
import { Colors } from "@/constants/bienestar/colors";
import { Ionicons } from "@expo/vector-icons";

export interface ActionLineCardProps {
  item: ActionLine;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ActionLineCard({ item, onPress, style }: ActionLineCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        {item.header.image ? (
          <Image
            source={{ uri: buildMediaUrl(item.header.image.url) }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
             <Ionicons name="image-outline" size={40} color="#38BDF8" style={{ opacity: 0.5 }} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text type="defaultBold" color="primary" numberOfLines={2} style={styles.title}>
          {item.header.title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20, // Bordes más redondeados y modernos
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  imageContainer: {
    aspectRatio: 1, // Asegura que todas las fotos sean cuadradas y simétricas
    width: "100%",
    backgroundColor: "#F8FAFC",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
    height: 65, // Altura fija para que todos los cuadros de texto midan lo mismo
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
    fontWeight: '700',
  },
});
