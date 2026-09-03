import {
  Pressable,
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { Colors } from "@/constants/bienestar/colors";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { AnimatedText } from "@/components/bienestar/primitives/Text";
import { Header } from "@/components/bienestar/layout/Header";
import { Header as IHeader, Layout } from "@/types/bienestar/components";
import { Ionicons } from "@expo/vector-icons";

export interface ScrollViewLayoutProps extends ScrollViewProps {
  header: IHeader;
  layout: Layout;
  stickyImage?: boolean;
  onRefresh?: () => void;
  onBack?: () => void;
}

export function ScrollViewLayout({
  header,
  layout,
  stickyImage = false,
  children,
  onRefresh,
  onBack,
  ...props
}: ScrollViewLayoutProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const offset = useScrollViewOffset(scrollRef);

  const svgAnimatedStyle = useAnimatedStyle(
    () => {
      const range = layout.height - layout.minHeight;
      if (range <= 0) return { top: 0 };

      return {
        top: interpolate(
          offset.value,
          [0, range],
          [0, -range],
          Extrapolation.CLAMP
        ),
      };
    },
    [layout]
  );

  const textAnimatedStyle = useAnimatedStyle(
    () => {
      const range = layout.height - layout.minHeight;
      if (range <= 0) return { transform: [{ translateY: 0 }] };

      return {
        transform: [
          {
            translateY: interpolate(
              offset.value,
              [0, range],
              [0, layout.height / 2 - (layout.minHeight / 2 + 16)],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    },
    [layout]
  );

  const imageAnimatedStyle = useAnimatedStyle(
    () => {
      const range = layout.height - layout.minHeight;
      if (range <= 0) return { transform: [{ translateY: 0 }] };

      let translateY = 0;
      if (stickyImage) {
        translateY = interpolate(
          offset.value,
          [0, range],
          [0, range],
          Extrapolation.CLAMP
        );
      } else {
        const secondRangeStart = range;
        const secondRangeEnd = layout.height;
        if (secondRangeStart !== secondRangeEnd) {
          translateY = interpolate(
            offset.value,
            [secondRangeStart, secondRangeEnd],
            [0, -layout.minHeight],
            {
              extrapolateLeft: Extrapolation.CLAMP,
            }
          );
        }
      }

      return {
        transform: [{ translateY }],
      };
    },
    [stickyImage, layout]
  );

  return (
    <View style={[{ flex: 1, backgroundColor: Colors.background }, props.style]}>
      <ScrollView
        {...props}
        ref={scrollRef}
        refreshControl={
          <RefreshControl
            progressViewOffset={layout.height || 40}
            refreshing={false}
            enabled={!!onRefresh}
            onRefresh={onRefresh}
            tintColor={Colors.secondary}
          />
        }
      >
        {layout.height > 0 && <View style={{ height: layout.height }} />}

        {children}
      </ScrollView>

      {layout.height > 0 && (
        <Animated.View
          style={[
            svgAnimatedStyle,
            {
              position: "absolute",
              height: layout.height,
              width: "100%",
            },
          ]}
        >
          <Header layout={layout} />

          {onBack && (
            <Pressable
              onPress={onBack}
              style={{
                position: "absolute",
                top: 40,
                left: 16,
                zIndex: 50,
                padding: 8,
                backgroundColor: layout.height === 0 ? 'rgba(0, 74, 139, 0.1)' : 'transparent', // Fondo sutil si no hay header azul
                borderRadius: 20,
              }}
            >
              <Ionicons name="arrow-back" size={28} color={layout.height === 0 ? Colors.primary : "white"} />
            </Pressable>
          )}

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AnimatedText
              type="title"
              color="white"
              style={[
                textAnimatedStyle,
                {
                  paddingLeft: onBack ? 56 : 16, // Espacio para la flecha
                  paddingRight: 16,
                  marginTop: onBack ? 20 : 0,
                },
              ]}
            >
              {header.title}
            </AnimatedText>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
