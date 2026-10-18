import { useCallback, forwardRef, LegacyRef } from "react";
import {
  ActivityIndicator,
  Pressable as PressableNative,
  PressableProps as PressableNativeProps,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimatedText } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { Link, LinkProps } from "expo-router";

export interface ButtonProps extends PressableProps {
  link?: false | LinkProps;
}

export function Button({ link = false, ...props }: ButtonProps) {
  if (link !== false)
    return (
      <Link asChild {...link}>
        <Pressable {...props} />
      </Link>
    );
  else return <Pressable {...props} />;
}

interface PressableProps extends PressableNativeProps {
  type?: "solid" | "outline" | "text";
  color?: "primary" | "secondary" | "text";
  title: string;
  isLoading?: boolean;
  ref?: LegacyRef<View>;
}

const Pressable = forwardRef<View, PressableProps>(
  (
    { title, type = "solid", color = "primary", isLoading = false, ...props },
    ref
  ) => {
    const pressed = useSharedValue(0);

    // Obtener colores base con fallbacks para evitar errores de Reanimated
    const baseColor = Colors[color] || Colors.primary;
    const darkColor = color === "text" ? Colors.text : (Colors[`${color}_dark`] || Colors.primary_dark);
    const accentColor = Colors.accent || "#E2E8F0";

    const containerAnimatedStyle = useAnimatedStyle(() => {
      if (type === "outline") {
        return {
          borderColor: baseColor,
          backgroundColor: interpolateColor(
            pressed.value,
            [0, 1],
            ["#FFFFFF00", accentColor]
          ),
          borderWidth: 1,
        };
      }
      if (type === "text") {
        return {
          backgroundColor: interpolateColor(
            pressed.value,
            [0, 1],
            ["#FFFFFF00", accentColor]
          ),
          borderWidth: 0,
        };
      }
      return {
        backgroundColor: interpolateColor(
          pressed.value,
          [0, 1],
          [baseColor, darkColor]
        ),
        borderWidth: 0,
      };
    }, [pressed, baseColor, darkColor, accentColor, type]);

    const textAnimatedStyle = useAnimatedStyle(() => {
      if (type === "outline") {
        return {
          color: baseColor,
        };
      }
      if (type === "text") {
        return {
          color: interpolateColor(
            pressed.value,
            [0, 1],
            [baseColor, darkColor]
          ),
        };
      }
      return {
        color: interpolateColor(
          pressed.value,
          [0, 1],
          [
            color === "text" ? accentColor : Colors.alternative,
            Colors.background,
          ]
        ),
      };
    }, [pressed, color, baseColor, darkColor, accentColor, type]);

    const onPressIn = useCallback(() => {
      pressed.value = withTiming(1, { duration: 150 });
    }, [pressed]);

    const onPressOut = useCallback(() => {
      pressed.value = withTiming(0, { duration: 150 });
    }, [pressed]);

    return (
      <PressableNative
        ref={ref}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isLoading}
        {...props}
      >
        <Animated.View
          style={[
            {
              borderRadius: 5,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              justifyContent: "center",
            },
            containerAnimatedStyle,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={type === "solid" ? Colors.alternative : Colors[color]}
            />
          ) : (
            <AnimatedText style={[textAnimatedStyle]}>
              {title}
            </AnimatedText>
          )}
        </Animated.View>
      </PressableNative>
    );
  }
);
