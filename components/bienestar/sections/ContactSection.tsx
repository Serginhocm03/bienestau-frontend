import { FC } from "react";
import { View, ViewStyle } from "react-native";

import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { Ionicons } from "@expo/vector-icons";
import { Contact } from "@/types/bienestar/components";

export interface ContactSectionProps extends Contact {
  style?: ViewStyle;
  BeforeComponent?: FC;
}

export function ContactSection({
  style,
  BeforeComponent,
  ...props
}: ContactSectionProps) {
  if (
    !props.email &&
    !props.phone &&
    !props.address &&
    !props.extra &&
    !BeforeComponent
  )
    return <></>;

  return (
    <View
      style={[
        {
          padding: 16,
          borderWidth: 1,
          borderColor: Colors.accent,
          borderRadius: 8,
          gap: 16,
        },
        style,
      ]}
    >
      <Text color="primary" type="subtitle">
        Información General
      </Text>

      {BeforeComponent && <BeforeComponent />}
      <View style={{ gap: 8 }}>
        {props.email && (
          <View style={{ flexDirection: "row", gap: 8, alignItems: 'center' }}>
            <Ionicons size={20} name="mail" color={Colors.secondary} />
            <Text style={{ fontSize: 13, flex: 1 }} numberOfLines={2}>{props.email}</Text>
          </View>
        )}
        {props.phone && (
          <View style={{ flexDirection: "row", gap: 8, alignItems: 'center' }}>
            <Ionicons size={20} name="call" color={Colors.secondary} />
            <Text style={{ fontSize: 13, flex: 1 }}>{props.phone}</Text>
          </View>
        )}
        {props.address && (
          <View style={{ flexDirection: "row", gap: 8, alignItems: 'flex-start' }}>
            <Ionicons size={20} name="map" color={Colors.secondary} style={{ marginTop: 2 }} />
            <Text style={{ fontSize: 13, flex: 1, lineHeight: 18 }}>{props.address}</Text>
          </View>
        )}
        {props.extra && (
          <View style={{ flexDirection: "row", gap: 8, alignItems: 'flex-start' }}>
            <Ionicons
              size={20}
              name="information-circle"
              color={Colors.secondary}
              style={{ marginTop: 2 }}
            />
            <Text style={{ fontSize: 13, flex: 1, lineHeight: 18 }}>{props.extra}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
