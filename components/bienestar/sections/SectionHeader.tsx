import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";

export interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
      <Text type="tag" color="primary" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 0,
  },
  indicator: {
    width: 6,
    height: 24,
    backgroundColor: Colors.secondary, // Rojo #C61628
    marginRight: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: "bold",
  },
});
