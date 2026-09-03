import { View } from "react-native";
import { StatusBar as StatusBarNative } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/bienestar/colors";

export function StatusBar() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBarNative style="light" />
      <View
        style={{
          height: insets.top,
          backgroundColor: Colors.primary,
        }}
      />
    </>
  );
}
