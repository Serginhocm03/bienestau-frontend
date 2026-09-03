import { useWindowDimensions, View } from "react-native";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/bienestar/colors";
import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";
import { Text } from "@/components/bienestar/primitives/Text";
import { Button } from "@/components/bienestar/from/Button";
import { StatusBar } from "@/components/bienestar/navigation/StatusBar";
import { WifiOff } from "@/assets/icons/WifiOff";

export default function Offline() {
  const { refresh } = useNetInfoInstance();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  return (
    <>
      <StatusBar />
      <ScrollViewLayout
        header={{
          title: "Sin conexión",
        }}
        layout={{ minHeight: 200, height: 200 }}
        onRefresh={refresh}
      >
        <View
          style={{
            width: width,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            height: height - (200 + insets.top) * (3 / 2),
          }}
        >
          <WifiOff width={width / 3} height={width / 3} fill={Colors.accent} />

          <Text
            type="subtitle"
            color="accent"
            style={{
              textAlign: "center",
            }}
          >
            Revisa tu conexión a internet y vuelve a intentarlo.
          </Text>

          <Button
            type="solid"
            color="secondary"
            title="Reintentar"
            onPress={refresh}
            style={{
              marginTop: 16,
            }}
          />
        </View>
      </ScrollViewLayout>
    </>
  );
}
