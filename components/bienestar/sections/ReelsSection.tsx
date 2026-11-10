import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Image as RNImage } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { ReelItem, ReelsViewerModal } from "./ReelsViewerModal";

export const SAMPLE_REELS: ReelItem[] = [
  {
    id: "r1",
    title: "¡Goles y momentos del Torneo Interfacultades 2026! ⚽🏆",
    creator: "@deportes_cesmag",
    views: "2.4k",
    likes: 482,
    commentsCount: 38,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    tag: "🔥 TENDENCIA",
  },
  {
    id: "r2",
    title: "Tarde de música y cultura en la Plaza Capuchina 🎸🎵",
    creator: "@cultura_unicesmag",
    views: "3.1k",
    likes: 620,
    commentsCount: 52,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    tag: "✨ DESTACADO",
  },
  {
    id: "r3",
    title: "Jornada de Pausas Activas y Bienestar Mental 🧠❤️",
    creator: "@salud_bienestau",
    views: "1.8k",
    likes: 310,
    commentsCount: 24,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    tag: "🔴 EN VIVO",
  },
  {
    id: "r4",
    title: "Celebración Día de la Franciscanidad Capuchina 🕊️✨",
    creator: "@pastoral_cesmag",
    views: "4.2k",
    likes: 890,
    commentsCount: 76,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4",
    tag: "⭐ IMPERDIBLE",
  },
];

export function ReelsSection() {
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      {/* ENCABEZADO DE LA SECCIÓN DE REELS */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <View style={styles.lineIndicator} />
          <View>
            <Text type="defaultBold" color="primary" style={styles.sectionTitle}>
              🎬 REELS & MOMENTOS CAMPUS
            </Text>
            <Text color="gray" style={styles.subtitle}>
              Videos cortos de la vida universitaria en Unicesmag
            </Text>
          </View>
        </View>
      </View>

      {/* CARROUSEL HORIZONTAL DE REELS TIKTOK-STYLE */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SAMPLE_REELS.map((reel, index) => (
          <Pressable
            key={reel.id}
            onPress={() => setSelectedReelIndex(index)}
            style={styles.reelCard}
          >
            {/* GRADIENTE Y FONDO OSCURO DEL REEL */}
            <View style={styles.cardImagePlaceholder}>
              <MaterialCommunityIcons
                name="play-circle"
                size={48}
                color="rgba(255,255,255,0.9)"
              />
            </View>

            <LinearGradient
              colors={["transparent", "rgba(15, 23, 42, 0.85)"]}
              style={styles.cardGradient}
            >
              {/* BADGE SUPERIOR */}
              {reel.tag && (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{reel.tag}</Text>
                </View>
              )}

              {/* VISTAS Y ME GUSTA */}
              <View style={styles.statsRow}>
                <View style={styles.statPill}>
                  <MaterialCommunityIcons name="eye-outline" size={12} color="white" />
                  <Text style={styles.statText}>{reel.views}</Text>
                </View>

                <View style={styles.statPill}>
                  <MaterialCommunityIcons name="heart" size={12} color="#EF4444" />
                  <Text style={styles.statText}>{reel.likes}</Text>
                </View>
              </View>

              {/* TÍTULO Y CREADOR */}
              <Text style={styles.reelTitle} numberOfLines={2}>
                {reel.title}
              </Text>
              <Text style={styles.creatorText}>{reel.creator}</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>

      {/* MODAL FULL SCREEN REELS VIEWER */}
      {selectedReelIndex !== null && (
        <ReelsViewerModal
          visible={selectedReelIndex !== null}
          onClose={() => setSelectedReelIndex(null)}
          reels={SAMPLE_REELS}
          initialIndex={selectedReelIndex}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lineIndicator: {
    width: 4,
    height: 28,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  reelCard: {
    width: 145,
    height: 225,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.primary_dark,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  cardImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 12,
  },
  tagBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  statsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  reelTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    marginBottom: 4,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  creatorText: {
    color: "#CBD5E1",
    fontSize: 10,
    fontWeight: "600",
  },
});
