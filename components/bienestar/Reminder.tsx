import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
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

    if (diffDays === 0) return { text: "¡ES HOY!", level: "urgent" };
    if (diffDays === 1) return { text: "MAÑANA", level: "warning" };
    if (diffDays < 0) return { text: "FINALIZADO", level: "muted" };
    return { text: `EN ${diffDays} DÍAS`, level: "info" };
  };

  const badgeInfo = getDaysLeft();
  const isEvent = !!fecha_evento;

  return (
    <View style={styles.cardContainer}>
      {/* Icon Ring Box */}
      <View style={styles.iconWrapper}>
        <View style={[styles.iconCircle, isEvent ? styles.calendarBg : styles.bellBg]}>
          <MaterialCommunityIcons
            size={24}
            name={isEvent ? "calendar-clock-outline" : "bell-ring-outline"}
            color={isEvent ? Colors.primary : Colors.secondary}
          />
          {!isEvent && <View style={styles.notificationDot} />}
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentBox}>
        <View style={styles.headerRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>

          {badgeInfo && (
            <View
              style={[
                styles.badge,
                badgeInfo.level === "urgent" && styles.badgeUrgent,
                badgeInfo.level === "warning" && styles.badgeWarning,
                badgeInfo.level === "muted" && styles.badgeMuted,
                badgeInfo.level === "info" && styles.badgeInfo,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  (badgeInfo.level === "urgent" || badgeInfo.level === "warning") && styles.badgeTextLight,
                ]}
              >
                {badgeInfo.text}
              </Text>
            </View>
          )}
        </View>

        {description ? (
          <Text style={styles.descriptionText} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>

      {/* Action Arrow */}
      <View style={styles.arrowBox}>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bellBg: {
    backgroundColor: "#FFF1F2", // Soft red background
    borderWidth: 1,
    borderColor: "#FFE4E6",
  },
  calendarBg: {
    backgroundColor: "#EFF6FF", // Soft blue background
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  contentBox: {
    flex: 1,
    gap: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.primary,
    flex: 1,
    letterSpacing: -0.2,
  },
  descriptionText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  arrowBox: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeUrgent: {
    backgroundColor: Colors.secondary,
  },
  badgeWarning: {
    backgroundColor: "#EA580C",
  },
  badgeMuted: {
    backgroundColor: "#F1F5F9",
  },
  badgeInfo: {
    backgroundColor: "#E0F2FE",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.primary,
  },
  badgeTextLight: {
    color: "#FFFFFF",
  },
});
