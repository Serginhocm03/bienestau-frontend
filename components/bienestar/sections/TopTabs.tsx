import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TabType = "noticias" | "eventos";

export interface TopTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TopTabs({ activeTab, onTabChange }: TopTabsProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.secondary, // Rojo #C61628
  },
  activeText: {
    fontWeight: "bold",
  },
});
