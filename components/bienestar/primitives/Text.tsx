import {
  StyleSheet,
  Text as TextNative,
  TextProps as TextNativeProps,
} from "react-native";

import { Colors } from "@/constants/bienestar/colors";
import Animated from "react-native-reanimated";

/**
 * Props for the wrapper around the Text component.
 *
 * - type: The type of the text.
 * - color: The color of the text.
 * */
export interface TextProps extends TextNativeProps {
  type?: "default" | "defaultBold" | "title" | "subtitle" | "hero" | "summary" | "tag" | "tab";
  color?: keyof typeof Colors;
}

/**
 * Wrapper around the Text component.
 *
 * color: The color of the text.
 * type: The type of the text.
 */
export function Text({
  color = "text",
  type = "default",
  style,
  ...props
}: TextProps) {
  return (
    <TextNative
      style={[
        {
          fontFamily: "Roboto",
          color: Colors[color] || Colors.primary,
        },
        styles[type],
        style,
      ]}
      {...props}
    ></TextNative>
  );
}

/**
 * Wrapper around the Animated.Text component.
 *
 * color: The color of the text.
 * type: The type of the text.
 */
export function AnimatedText({
  color = "text",
  type = "default",
  style,
  ...props
}: TextProps) {
  return (
    <Animated.Text
      style={[
        {
          fontFamily: "Roboto",
          color: Colors[color] || Colors.primary,
        },
        styles[type],
        style,
      ]}
      {...props}
    ></Animated.Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
  },
  defaultBold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  hero: {
    fontSize: 26,
    fontWeight: "bold",
    lineHeight: 30,
  },
  summary: {
    fontSize: 15,
    lineHeight: 20,
  },
  tag: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  tab: {
    fontSize: 14,
    fontWeight: "600",
  },
});
