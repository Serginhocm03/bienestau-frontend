import React from "react";
import { View, Image, StyleSheet, useWindowDimensions, Pressable } from "react-native";
import { Text } from "@/components/bienestar/primitives/Text";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { Media } from "@/types/bienestar/primitives";
import { Colors } from "@/constants/bienestar/colors";

export interface NewsHeroProps {
  title: string;
  description?: string;
  image: Media;
  onPress?: () => void;
}

export function NewsHero({ title, description, image, onPress }: NewsHeroProps) {
  const { width, height } = useWindowDimensions();
  const imageUrl = buildMediaUrl(image?.url);

  return (
    <Pressable onPress={onPress} style={[styles.container, { width, height: height * 0.55 }]}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text type="hero" color="white" style={styles.title}>
            {title}
          </Text>
          {description && (
            <Text type="summary" color="white" numberOfLines={2} style={styles.summary}>
              {description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  content: {
    padding: 20,
    paddingBottom: 30,
    // Degradado manual simulado (oscuro para contraste)
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  title: {
    marginBottom: 6,
  },
  summary: {
    opacity: 0.9,
  },
});
