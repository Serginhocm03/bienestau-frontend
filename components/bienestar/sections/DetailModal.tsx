import React from "react";
import { Modal, View, ScrollView, Pressable, useWindowDimensions, StyleSheet } from "react-native";
import { Text } from "@/components/bienestar/primitives/Text";
import { ImageAutoScale } from "@/components/bienestar/primitives/ImageAutoScale";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { Colors } from "@/constants/bienestar/colors";
import { Media } from "@/types/bienestar/primitives";

export interface DetailModalProps {
  visible: boolean;
  onClose: () => void;
  item: {
    title: string;
    description?: string;
    image?: Media;
    url?: string;
  } | null;
}

export function DetailModal({ visible, onClose, item }: DetailModalProps) {
  const { width } = useWindowDimensions();
  if (!item) return null;

  const imageUrl = item.image ? buildMediaUrl(item.image.url) : (item.url ? buildMediaUrl(item.url) : null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {imageUrl && (
          <ImageAutoScale
            source={{ uri: imageUrl }}
            width={width}
            style={styles.image}
          />
        )}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text type="subtitle" color="primary" style={styles.title}>
            {item.title}
          </Text>

          {item.description && (
            <Text color="black" style={styles.description}>
              {item.description}
            </Text>
          )}
        </ScrollView>

        <Pressable
          onPress={onClose}
          style={styles.closeButton}
        >
          <Text color="white" style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  image: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 25,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  closeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
