import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@/components/bienestar/primitives/Text";
import { Button } from "@/components/bienestar/from/Button";

export default function Carnet() {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Text type="title">Carnet</Text>
      <Button
        title="Open Drawer"
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
      />
    </SafeAreaView>
  );
}
