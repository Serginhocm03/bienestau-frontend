import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { Media } from "@/types/bienestar/primitives";

export interface NewsFeedItemProps {
  title: string;
  description?: string;
  image?: Media;
  tag?: string;
  onPress?: () => void;
  isLast?: boolean;
}

export function NewsFeedItem({
  title,
  description,
  image,
  tag,
  onPress,
  isLast = false,
}: NewsFeedItemProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={styles.content}>
        <View style={styles.textSide}>
          {tag && (
            <Text
              type="tag"
              color="secondary"
              style={styles.tag}
            >
              {tag}
            </Text>
          )}
          <Text type="subtitle" color="primary" style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {description && (
            <Text type="summary" color="gray" numberOfLines={2} style={styles.summary}>
              {description}
            </Text>
          )}
        </View>
        <Image
          source={{ uri: buildMediaUrl(image?.url) }}
          style={[styles.thumbnail, { backgroundColor: '#F8FAFC' }]}
          contentFit="contain"
          transition={200}
        />
      </Pressable>
      {!isLast && <View style={styles.separator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    gap: 12,
  },
  textSide: {
    flex: 1,
  },
  tag: {
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    marginBottom: 6,
  },
  summary: {
    fontSize: 14,
  },
  thumbnail: {
    width: 100,
    height: 70,
    borderRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.accent,
    width: "100%",
    marginLeft: 20,
  },
});
