import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { ReelItem, ReelsViewerModal } from "./ReelsViewerModal";

export const SAMPLE_REELS: ReelItem[] = [
  {
    id: "r1",
    title: "¡Goles y mejores momentos del Torneo Interfacultades 2026! ⚽🏆",
    creator: "@deportes_cesmag",
    views: "2.4k",
    likes: 482,
    commentsCount: 38,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    tag: "🔥 TENDENCIA",
  },
  {
    id: "r2",
    title: "Tarde de música y cultura capuchina en la Plaza Central 🎸🎵",
    creator: "@cultura_unicesmag",
    views: "3.1k",
    likes: 620,
    commentsCount: 52,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    tag: "✨ DESTACADO",
  },
  {
    id: "r3",
    title: "Jornada de Pausas Activas y Salud Mental en el Campus 🧠❤️",
    creator: "@salud_bienestau",
    views: "1.8k",
    likes: 310,
    commentsCount: 24,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    tag: "🔴 EN VIVO",
  },
  {
    id: "r4",
    title: "Celebración Día de la Franciscanidad e Integración 🕊️✨",
    creator: "@pastoral_cesmag",
    views: "4.2k",
    likes: 890,
    commentsCount: 76,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4",
    tag: "⭐ IMPERDIBLE",
  },
];

export function ReelsSection() {
  const { width } = useWindowDimensions();
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(
    null
  );
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});
  const [likesCountMap, setLikesCountMap] = useState<{ [id: string]: number }>(
    {}
  );

  const toggleLike = (reelId: string, currentLikes: number) => {
    const isLiked = likedMap[reelId] || false;
    setLikedMap((prev) => ({ ...prev, [reelId]: !isLiked }));
    setLikesCountMap((prev) => ({
      ...prev,
      [reelId]: isLiked ? currentLikes - 1 : currentLikes + 1,
    }));
  };

  const handleShare = (title: string) => {
    Alert.alert("Compartir Reel", `¡Enlace de "${title}" copiado al portapapeles!`);
  };

  return (
    <View style={styles.container}>
      {/* ENCABEZADO ELEGANTE */}
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

      {/* FEED VERTICAL ORGANIZADO ESTILO TIKTOK / REELS */}
      <View style={styles.verticalFeed}>
        {SAMPLE_REELS.map((reel, index) => {
          const isLiked = likedMap[reel.id] || false;
          const currentLikes = likesCountMap[reel.id] ?? reel.likes;

          return (
            <View key={reel.id} style={styles.tiktokVideoCard}>
              {/* REPRODUCTOR DE VIDEO EN LÍNEA TIKTOK */}
              <WebView
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                        <style>
                          body, html { margin: 0; padding: 0; background-color: #000; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; }
                          video { width: 100%; height: 100%; object-fit: cover; }
                        </style>
                      </head>
                      <body>
                        <video src="${reel.videoUrl}" controls playsinline loop muted></video>
                      </body>
                    </html>
                  `,
                }}
                style={StyleSheet.absoluteFillObject}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
              />

              {/* OVERLAY GRADIENTE DE ALTA CALIDAD */}
              <LinearGradient
                colors={[
                  "rgba(15, 23, 42, 0.5)",
                  "transparent",
                  "rgba(15, 23, 42, 0.92)",
                ]}
                locations={[0, 0.35, 1]}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />

              {/* BADGES SUPERIORES (TENDENCIA Y VISTAS) */}
              <View style={styles.topBadgeRow}>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{reel.tag}</Text>
                </View>

                <View style={styles.viewsBadge}>
                  <MaterialCommunityIcons name="eye-outline" size={13} color="white" />
                  <Text style={styles.viewsText}>{reel.views} vistas</Text>
                </View>
              </View>

              {/* BARRA LATERAL DERECHA DE ACCIONES (ESTILO TIKTOK) */}
              <View style={styles.sideActionsColumn}>
                <Pressable
                  onPress={() => toggleLike(reel.id, reel.likes)}
                  style={styles.actionBtn}
                >
                  <View style={[styles.actionCircle, isLiked && styles.actionCircleLiked]}>
                    <MaterialCommunityIcons
                      name={isLiked ? "heart" : "heart-outline"}
                      size={26}
                      color={isLiked ? Colors.secondary : "white"}
                    />
                  </View>
                  <Text style={styles.actionLabel}>{currentLikes}</Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    Alert.alert(
                      "Comentarios",
                      "Módulo de comentarios de Reels en desarrollo."
                    )
                  }
                  style={styles.actionBtn}
                >
                  <View style={styles.actionCircle}>
                    <MaterialCommunityIcons name="comment-text-outline" size={24} color="white" />
                  </View>
                  <Text style={styles.actionLabel}>{reel.commentsCount}</Text>
                </Pressable>

                <Pressable onPress={() => handleShare(reel.title)} style={styles.actionBtn}>
                  <View style={styles.actionCircle}>
                    <MaterialCommunityIcons name="share-variant-outline" size={24} color="white" />
                  </View>
                  <Text style={styles.actionLabel}>Compartir</Text>
                </Pressable>

                <Pressable
                  onPress={() => setSelectedReelIndex(index)}
                  style={styles.actionBtn}
                >
                  <View style={styles.actionCircle}>
                    <MaterialCommunityIcons name="fullscreen" size={26} color="white" />
                  </View>
                  <Text style={styles.actionLabel}>Pantalla</Text>
                </Pressable>
              </View>

              {/* DETALLES DEL CREADOR Y TÍTULO DEL VIDEO (INFERIOR IZQUIERDA) */}
              <View style={styles.bottomOverlay}>
                <View style={styles.creatorRow}>
                  <View style={styles.avatarCircle}>
                    <Text style={{ fontSize: 14 }}>🎓</Text>
                  </View>
                  <Text style={styles.creatorHandle}>{reel.creator}</Text>
                  <MaterialCommunityIcons name="check-decagram" size={16} color="#38BDF8" />
                  <View style={styles.followBadge}>
                    <Text style={styles.followBadgeText}>+ SEGUIR</Text>
                  </View>
                </View>

                <Text style={styles.captionText}>{reel.title}</Text>

                <View style={styles.audioRow}>
                  <MaterialCommunityIcons name="music-note" size={14} color="#CBD5E1" />
                  <Text style={styles.audioText}>
                    Sonido Original • Bienestar Institucional Unicesmag
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

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
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerRow: {
    marginBottom: 16,
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
  verticalFeed: {
    gap: 20,
  },
  tiktokVideoCard: {
    width: "100%",
    height: 500,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#0B0F19",
    position: "relative",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  topBadgeRow: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  tagBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tagBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  viewsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  viewsText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  sideActionsColumn: {
    position: "absolute",
    right: 14,
    bottom: 30,
    alignItems: "center",
    gap: 16,
    zIndex: 10,
  },
  actionBtn: {
    alignItems: "center",
    gap: 4,
  },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  actionCircleLiked: {
    backgroundColor: "rgba(198, 22, 40, 0.35)",
    borderColor: Colors.secondary,
  },
  actionLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomOverlay: {
    position: "absolute",
    left: 16,
    right: 76,
    bottom: 20,
    zIndex: 10,
    gap: 8,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  creatorHandle: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  followBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  followBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  captionText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  audioText: {
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: "600",
  },
});
