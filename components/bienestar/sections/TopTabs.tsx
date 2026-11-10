import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export type TabType = "noticias" | "eventos";

export interface TopTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
}

export function TopTabs({
  activeTab,
  onTabChange,
  unreadCount = 0,
}: TopTabsProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleRemindersClick = () => {
    router.push("/(protected)/bienestar/reminders");
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

      {/* BOTÓN DE AVISOS EN LA ESQUINA SUPERIOR DERECHA */}
      <Pressable onPress={handleRemindersClick} style={styles.bellBtn}>
        <MaterialCommunityIcons name="bell-ring-outline" size={24} color={Colors.primary} />
        {unreadCount > 0 && (
          <View style={styles.bellBadge}>
            <Text style={styles.bellBadgeText}>{unreadCount}</Text>
          </View>
        )}
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
  bellBtn: {
    padding: 8,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  bellBadge: {
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
  bellBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
});
