import { ReactNode, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  PressableProps,
  LayoutChangeEvent,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/bienestar/colors";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    tabPositionX.value = withSpring(buttonWidth * state.index + 6, {
      duration: 1000,
      dampingRatio: 0.8,
    });
  }, [state.index]);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const buttonWidth = dimensions.width / state.routes.length;

  const tabPositionX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
  }));

  const onTabBarLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  };

  return (
    <View
      onLayout={onTabBarLayout}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.alternative,
        marginBottom: insets.bottom,
        paddingVertical: 15,

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            backgroundColor: Colors.secondary,
            borderRadius: 30,
            height: dimensions.height - 10,
            width: buttonWidth - 12,
          },
        ]}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            color={isFocused ? Colors.background : Colors.text}
            label={label}
          >
            {options.tabBarIcon && (
              <options.tabBarIcon
                size={24}
                focused={isFocused}
                color={isFocused ? Colors.background : Colors.text}
              />
            )}
          </TabBarButton>
        );
      })}
    </View>
  );
}

function TabBarButton({
  onPress,
  onLongPress,
  color,
  label,
  children,
}: PressableProps & {
  color: string;
  label: string;
  children?: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabbarItem}
    >
      <Animated.View style={{}}>{children}</Animated.View>

      <Animated.Text style={[{}, { color: color, fontSize: 12 }]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
