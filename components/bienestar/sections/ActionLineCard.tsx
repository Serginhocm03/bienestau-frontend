import React from "react";
import { View, StyleSheet, Pressable, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/bienestar/primitives/Text";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { ActionLine } from "@/types/bienestar/collections";
import { Colors } from "@/constants/bienestar/colors";
import { LinearGradient } from 'expo-linear-gradient';

export interface ActionLineCardProps {
  item: ActionLine;
  onPress?: () => void;
  style?: ViewStyle;
  isFeatured?: boolean;
}

export function ActionLineCard({ item, onPress, style, isFeatured = false }: ActionLineCardProps) {
  const localBanner = getLocalBanner(item.header.title);
  const hasImage = !!item.header.image || !!localBanner;
  const symbol = getEmojiSymbol(item.header.title);

  return (
    <Pressable onPress={onPress} style={[styles.container, isFeatured && styles.featuredContainer, style]}>
      <View style={[styles.imageWrapper, isFeatured && styles.featuredImageWrapper]}>
        {hasImage ? (
          <Image
            source={localBanner ? localBanner : { uri: buildMediaUrl(item.header.image?.url) }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.placeholder}>
             <Text style={{ fontSize: 40, opacity: 0.3 }}>✨</Text>
          </View>
        )}

        <LinearGradient
          colors={['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.9)']}
          style={styles.gradient}
        >
          <View style={styles.textContainer}>
            <View style={[styles.iconCircle, isFeatured && styles.featuredIconCircle]}>
                {/* Símbolos universales del sistema (Emojis) */}
                <Text style={[styles.emojiIcon, isFeatured && { fontSize: 26 }]}>{symbol}</Text>
            </View>
            <Text style={[styles.title, isFeatured && styles.featuredTitle]} color="white">
              {item.header.title.toUpperCase()}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

function getLocalBanner(title: string) {
  const t = title.toLowerCase();
  if (t.includes('acompañamiento')) return require("@/assets/images/Banners/acompañamiento integral.jpg");
  if (t.includes('cultura') || t.includes('deporte')) return require("@/assets/images/Banners/deporte y cultura.jpg");
  if (t.includes('salud') || t.includes('humano')) return require("@/assets/images/Banners/Salud.jpg");
  if (t.includes('pastoral')) return require("@/assets/images/Banners/pastoral.jpg");
  if (t.includes('paz') || t.includes('convivencia')) return require("@/assets/images/Banners/convivencia paz.jpg");
  return null;
}

function getEmojiSymbol(name: string) {
    const n = name.toLowerCase();
    if (n.includes('acompañamiento')) return '👥';
    if (n.includes('desarrollo') || n.includes('salud')) return '❤️';
    if (n.includes('deporte') || n.includes('cultura')) return '⚽';
    if (n.includes('pastoral') || n.includes('franciscan')) return '🕊️';
    if (n.includes('paz') || n.includes('convivencia')) return '🤝';
    return '⭐';
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    backgroundColor: '#0F172A',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  featuredContainer: {
    borderRadius: 24,
    marginBottom: 16,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1.8,
    position: "relative",
  },
  featuredImageWrapper: {
    aspectRatio: 2.3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  featuredIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  emojiIcon: {
    fontSize: 22,
  },
  title: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
    flexShrink: 1,
  },
  featuredTitle: {
    fontSize: 15,
    letterSpacing: 0.8,
  },
});
