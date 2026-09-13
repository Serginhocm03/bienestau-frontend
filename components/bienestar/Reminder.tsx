import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { Reminder as IReminder } from "@/types/bienestar/collections";

export interface ReminderProps extends IReminder {}

export function Reminder({ title, description, fecha_evento }: ReminderProps) {
  const getDaysLeft = () => {
    if (!fecha_evento) return null;
    const date = new Date(fecha_evento);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "¡ES HOY!";
    if (diffDays === 1) return "MAÑANA";
    if (diffDays < 0) return "FINALIZADO";
    return `EN ${diffDays} DÍAS`;
  };

  const daysLeft = getDaysLeft();

  return (
    <View
      style={{
        padding: 12,
        gap: 16,
        flexDirection: "row",
        backgroundColor: Colors.background,
        borderRadius: 12,
        width: "100%",
        alignItems: "center",
      }}
    >
      <View style={{ marginLeft: 4, width: 50, alignItems: "center" }}>
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: '#F1F5F9',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <MaterialCommunityIcons
            size={28}
            name={fecha_evento ? "calendar" : "bell"}
            color={Colors.primary}
          />
        </View>
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <Text type="defaultBold" style={{ fontSize: 15, flex: 1, color: Colors.primary }} numberOfLines={1}>
            {title.toUpperCase()}
          </Text>
          {daysLeft && (
            <View style={{
              backgroundColor: daysLeft === "¡ES HOY!" ? Colors.secondary : '#F1F5F9',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6
            }}>
              <Text style={{
                fontSize: 10,
                fontWeight: '800',
                color: daysLeft === "¡ES HOY!" ? 'white' : Colors.secondary
              }}>
                {daysLeft}
              </Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 13, color: '#475569', lineHeight: 18 }} numberOfLines={2}>{description}</Text>
      </View>
    </View>
  );
}
