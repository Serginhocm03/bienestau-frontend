import { Stack } from "expo-router";

export default function WelfareLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* <Stack.Screen name="action-line" /> */}
    </Stack>
  );
}
