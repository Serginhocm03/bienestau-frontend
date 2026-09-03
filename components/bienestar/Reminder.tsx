import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { Reminder as IReminder } from "@/types/bienestar/collections";

export interface ReminderProps extends IReminder {}

export function Reminder({ title, description }: ReminderProps) {
  return (
    <View
      style={{
        padding: 8,
        gap: 16,

        flexDirection: "row",
        backgroundColor: Colors.alternative,
        borderRadius: 8,

        shadowColor: "#000", // Colors
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "100%",

        alignItems: "center",
      }}
    >
      <View
        style={{
          marginLeft: 8,
          width: 60,
          alignItems: "center",
        }}
      >
        <Ionicons size={60} name="notifications-circle-outline" />
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        <Text type="defaultBold" style={{ lineHeight: 16 }}>
          {title.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 12, lineHeight: 12 }}>{description}</Text>
      </View>
    </View>
  );
}
