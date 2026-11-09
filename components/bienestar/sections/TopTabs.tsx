import React from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type TabType = "noticias" | "eventos";

export interface TopTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount?: number;
  onCartPress?: () => void;
}

export function TopTabs({
  activeTab,
  onTabChange,
  cartCount = 0,
  onCartPress,
}: TopTabsProps) {
  const insets = useSafeAreaInsets();

  const handleCartClick = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      Alert.alert(
        "🛒 Carrito de Compras",
        "Módulo de prueba visual. Próximamente podrás adquirir artículos y servicios de Bienestar Institucional aquí."
      );
    }
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 8) }]}>
      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => onTabChange("noticias")}
          style={[styles.tab, activeTab === "noticias" && styles.activeTab]}
        >
          <Text
            type="tab"
            color={activeTab === "noticias" ? "primary" : "gray"}
            style={activeTab === "noticias" && styles.activeText}
          >
            NOTICIAS
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onTabChange("eventos")}
          style={[styles.tab, activeTab === "eventos" && styles.activeTab]}
        >
          <Text
            type="tab"
            color={activeTab === "eventos" ? "primary" : "gray"}
            style={activeTab === "eventos" && styles.activeText}
          >
            EVENTOS
          </Text>
        </Pressable>
      </View>

      {/* BOTÓN DEL CARRITO DE COMPRAS EN LA ESQUINA SUPERIOR DERECHA */}
      <Pressable onPress={handleCartClick} style={styles.cartBtn}>
        <MaterialCommunityIcons name="cart-outline" size={24} color={Colors.primary} />
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{cartCount}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingRight: 16,
  },
  tabsRow: {
    flex: 1,
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.secondary, // Rojo #C61628
  },
  activeText: {
    fontWeight: "bold",
  },
  cartBtn: {
    padding: 8,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cartBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: Colors.secondary,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
});
