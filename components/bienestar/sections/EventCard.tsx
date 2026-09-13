import React from "react";
import { View, StyleSheet, useWindowDimensions, Pressable, Image as RNImage } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/bienestar/primitives/Text";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { Media } from "@/types/bienestar/primitives";
import { Colors } from "@/constants/bienestar/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

export interface EventCardProps {
  title: string;
  description?: string;
  image: Media;
  tag?: string;
  onPress?: () => void;
  fecha_evento?: string;
}

export function EventCard({ title, description, image, tag, onPress, fecha_evento }: EventCardProps) {
  const { width } = useWindowDimensions();
  const imageUrl = buildMediaUrl(image?.url);

  return (
    <View style={styles.cardWrapper}>
      <Pressable onPress={onPress} style={styles.container}>
        <View style={[styles.imageContainer, { height: width * 0.5, backgroundColor: '#000' }]}>
          <RNImage
            source={{ uri: imageUrl }}
            style={[StyleSheet.absoluteFill, { opacity: 0.4 }]}
            blurRadius={10}
          />
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={styles.topGradient}
          />
          {tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text type="subtitle" color="primary" style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          <View style={styles.infoRow}>
            {fecha_evento && (
              <View style={styles.dateInfo}>
                <MaterialCommunityIcons name="calendar-clock" size={14} color={Colors.secondary} />
                <Text style={styles.infoText}>{fecha_evento}</Text>
              </View>
            )}
            <View style={styles.spacer} />
            <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.accent} />
          </View>

          {description && (
            <Text style={styles.summary} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  tagBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  summary: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});
