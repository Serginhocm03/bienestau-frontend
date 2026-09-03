import React from "react";
import { View, Image, StyleSheet, useWindowDimensions, Pressable } from "react-native";
import { Text } from "@/components/bienestar/primitives/Text";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { Media } from "@/types/bienestar/primitives";
import { Colors } from "@/constants/bienestar/colors";

export interface EventCardProps {
  title: string;
  description?: string;
  image: Media;
  tag?: string;
  onPress?: () => void;
}

export function EventCard({ title, description, image, tag, onPress }: EventCardProps) {
  const { width } = useWindowDimensions();
  const imageUrl = buildMediaUrl(image?.url);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.imageContainer, { width, height: width * (9 / 16) }]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {tag && (
          <View style={styles.tagBadge}>
            <Text type="tag" color="white" style={styles.tagText}>
              {tag}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text type="subtitle" color="primary" style={styles.title}>
          {title}
        </Text>
        {description && (
          <Text type="summary" color="gray" numberOfLines={2} style={styles.summary}>
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
  },
  image: {
    width: "100%",
    height: "100%",
  },
  tagBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
  },
  tagText: {
    fontSize: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
  },
});
