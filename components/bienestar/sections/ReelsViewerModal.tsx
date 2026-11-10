import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/bienestar/primitives/Text";

export interface ReelItem {
  id: string;
  title: string;
  creator: string;
  views: string;
  likes: number;
  commentsCount: number;
  videoUrl: string;
  tag?: string;
}

export interface ReelsViewerModalProps {
  visible: boolean;
  onClose: () => void;
  reels: ReelItem[];
  initialIndex?: number;
}

export function ReelsViewerModal({
  visible,
  onClose,
  reels,
  initialIndex = 0,
}: ReelsViewerModalProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});
  const [likesCountMap, setLikesCountMap] = useState<{ [id: string]: number }>({});

  if (!reels || reels.length === 0) return null;

  const currentReel = reels[currentIndex] || reels[0];
  const isLiked = likedMap[currentReel.id] || false;
  const currentLikes = likesCountMap[currentReel.id] ?? currentReel.likes;

  const toggleLike = () => {
    setLikedMap((prev) => ({
      ...prev,
      [currentReel.id]: !isLiked,
    }));
    setLikesCountMap((prev) => ({
      ...prev,
      [currentReel.id]: isLiked ? currentLikes - 1 : currentLikes + 1,
    }));
  };

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Bucle al inicio
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    Alert.alert(
      "Compartir Reel",
      `¡Enlace del Reel "${currentReel.title}" copiado al portapapeles!`,
      [{ text: "OK" }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={[styles.modalContainer, { width, height }]}>
        {/* REPRODUCTOR DE VIDEO FULL SCREEN TIKTOK / REELS */}
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
                  <video src="${currentReel.videoUrl}" controls playsinline autoplay loop muted></video>
                </body>
              </html>
            `,
          }}
          style={StyleSheet.absoluteFillObject}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
        />

        {/* SOMBRA SUPERIOR E INFERIOR */}
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.85)"]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        {/* ENCABEZADO: BOTÓN BARRAS Y BOTÓN CERRAR */}
        <View style={[styles.topHeader, { paddingTop: Math.max(insets.top + 10, 40) }]}>
          <View style={styles.reelBadge}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FFD700" />
            <Text style={styles.reelBadgeText}>REELS BIENESTAU</Text>
          </View>

          <Pressable onPress={onClose} style={styles.closeBtnCircle}>
            <MaterialCommunityIcons name="close" size={22} color="white" />
          </Pressable>
        </View>

        {/* NAVEGACIÓN FLOTANTE (SUBIR / BAJAR DE REEL) */}
        <View style={styles.navigationArrows}>
          <Pressable onPress={handlePrev} style={styles.navArrowBtn}>
            <MaterialCommunityIcons name="chevron-up" size={28} color="white" />
          </Pressable>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {reels.length}
          </Text>
          <Pressable onPress={handleNext} style={styles.navArrowBtn}>
            <MaterialCommunityIcons name="chevron-down" size={28} color="white" />
          </Pressable>
        </View>

        {/* BARRA ACCIONES LATERALES DERECHA (ME GUSTA, COMENTARIOS, COMPARTIR) */}
        <View style={styles.sideActionsContainer}>
          <Pressable onPress={toggleLike} style={styles.actionBtn}>
            <View style={[styles.iconCircle, isLiked && styles.iconCircleLiked]}>
              <MaterialCommunityIcons
                name={isLiked ? "heart" : "heart-outline"}
                size={28}
                color={isLiked ? "#EF4444" : "white"}
              />
            </View>
            <Text style={styles.actionText}>{currentLikes}</Text>
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
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="comment-text-outline" size={26} color="white" />
            </View>
            <Text style={styles.actionText}>{currentReel.commentsCount}</Text>
          </Pressable>

          <Pressable onPress={handleShare} style={styles.actionBtn}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="share-variant-outline" size={26} color="white" />
            </View>
            <Text style={styles.actionText}>Compartir</Text>
          </Pressable>
        </View>

        {/* PIE DE PÁGINA: DETALLES DEL REEL */}
        <View style={[styles.bottomInfo, { paddingBottom: Math.max(insets.bottom + 20, 30) }]}>
          <View style={styles.creatorRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>🎓</Text>
            </View>
            <Text style={styles.creatorText}>{currentReel.creator}</Text>
            <View style={styles.followBadge}>
              <Text style={styles.followText}>SIGUIENDO</Text>
            </View>
          </View>

          <Text style={styles.titleText}>{currentReel.title}</Text>

          <View style={styles.audioRow}>
            <MaterialCommunityIcons name="music-note" size={14} color="#CBD5E1" />
            <Text style={styles.audioText}>
              Sonido Original - Bienestar Institucional Unicesmag
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#000000",
    position: "relative",
  },
  topHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 20,
  },
  reelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 74, 139, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  reelBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  closeBtnCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  navigationArrows: {
    position: "absolute",
    right: 16,
    top: "35%",
    alignItems: "center",
    gap: 8,
    zIndex: 20,
  },
  navArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  sideActionsContainer: {
    position: "absolute",
    right: 16,
    bottom: "22%",
    alignItems: "center",
    gap: 16,
    zIndex: 20,
  },
  actionBtn: {
    alignItems: "center",
    gap: 4,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  iconCircleLiked: {
    backgroundColor: "rgba(239, 68, 68, 0.25)",
    borderColor: "#EF4444",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  bottomInfo: {
    position: "absolute",
    left: 16,
    right: 80,
    bottom: 0,
    zIndex: 20,
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
  },
  avatarText: {
    fontSize: 16,
  },
  creatorText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
  followBadge: {
    backgroundColor: "#C61628",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  followText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  audioText: {
    color: "#CBD5E1",
    fontSize: 11,
  },
});
