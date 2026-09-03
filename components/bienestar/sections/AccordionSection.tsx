import { Pressable, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "@/components/bienestar/primitives/Text";
import { Section } from "@/components/bienestar/sections/Section";
import { Colors } from "@/constants/bienestar/colors";
import {
  AccordionSection as IAccordionSection,
  Section as ISection,
} from "@/types/bienestar/section-components";

export interface AccordionSectionProps extends IAccordionSection {}

export function AccordionSection({
  title,
  collapsibles,
}: AccordionSectionProps) {
  return (
    <View style={{ paddingVertical: 16, gap: 16 }}>
      {title && (
        <Text color="primary" type="subtitle" style={{ marginHorizontal: 16 }}>
          {title}
        </Text>
      )}

      <View style={{ gap: 8 }}>
        {collapsibles.map((item, index) => (
          <Collapsible key={index} {...item} initiallyOpen={index === 0} />
        ))}
      </View>
    </View>
  );
}

export interface CollapsibleProps extends ISection {
  initiallyOpen?: boolean;
}

export function Collapsible({ title, initiallyOpen = false, ...section }: CollapsibleProps) {
  const ref = useAnimatedRef();
  const height = useSharedValue(0);
  const open = useSharedValue(initiallyOpen);
  const progress = useDerivedValue(() =>
    open.value ? withTiming(1) : withTiming(0)
  );

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * -180}deg` }],
  }));

  const heightAnimationStyle = useAnimatedStyle(() => {
    if (height.value <= 0) return { height: 0 };

    return {
      height: interpolate(
        progress.value,
        [0, 1],
        [0, height.value],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View
      style={{
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.accent,
        borderRadius: 8,
        marginHorizontal: 16,
        paddingVertical: 8,
      }}
    >
      <Pressable
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          gap: 8,
        }}
        onPress={() => {
          if (height.value === 0) {
            runOnUI(() => {
              "worklet";
              height.value = withTiming(measure(ref)!.height);
            })();
          } else {
            // No need to reset height.value here, withTiming handles progress
          }
          open.value = !open.value;
        }}
      >
        <Text style={{ flexShrink: 1 }} type="defaultBold" color="primary">{title}</Text>
        <Animated.View style={[iconStyle]}>
          <Ionicons name="chevron-down" size={24} color={Colors.primary} />
        </Animated.View>
      </Pressable>

      <Animated.View style={[heightAnimationStyle]}>
        <Animated.View
          ref={ref}
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        >
          <Section {...section} paddingVertical={8} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
