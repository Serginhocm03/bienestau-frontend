import React from "react";
import { View, StyleSheet, useWindowDimensions, Pressable, Image as RNImage } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/bienestar/primitives/Text";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { Media } from "@/types/bienestar/primitives";
import { Colors } from "@/constants/bienestar/colors";
import { LinearGradient } from 'expo-linear-gradient';

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
    <View style={[styles.container, { width, height: height * 0.55 }]}>
      <Pressable onPress={onPress} style={StyleSheet.absoluteFill}>
        <RNImage
          source={{ uri: imageUrl }}
          style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: 0.5 }]}
          blurRadius={15}
        />
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>DESTACADO</Text>
            </View>
            <Text type="hero" color="white" numberOfLines={3} style={styles.title}>
              {title}
            </Text>
            {description && (
              <Text type="summary" color="white" numberOfLines={3} style={styles.summary}>
                {description}
              </Text>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    overflow: 'hidden',
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: 20,
  },
  badge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  summary: {
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 20,
  }
});
