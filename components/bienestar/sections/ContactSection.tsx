import { FC } from "react";
import { View, ViewStyle, Image } from "react-native";

import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
            <Image
              source={require("@/assets/images/biñetas.png")}
              style={{ width: 20, height: 20, tintColor: Colors.secondary }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 13, flex: 1 }} numberOfLines={2}>{props.email}</Text>
          </View>
        )}
        {props.phone && (
          <View style={{ flexDirection: "row", gap: 8, alignItems: 'center' }}>
            <Image
              source={require("@/assets/images/Telefono.png")}
              style={{ width: 20, height: 20, tintColor: Colors.secondary }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 13, flex: 1 }}>{props.phone}</Text>
          </View>
        )}
        {props.address && (
          <View style={{ flexDirection: "row", gap: 8, alignItems: 'flex-start' }}>
            <Image
              source={require("@/assets/images/Maps.png")}
              style={{ width: 20, height: 20, tintColor: Colors.secondary, marginTop: 2 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 13, flex: 1, lineHeight: 18 }}>{props.address}</Text>
          </View>
        )}
        {props.extra && (
          <View style={{ flexDirection: "row", gap: 8, alignItems: 'flex-start' }}>
            <Image
              source={require("@/assets/images/biñetas.png")}
              style={{ width: 20, height: 20, tintColor: Colors.secondary, marginTop: 2 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 13, flex: 1, lineHeight: 18 }}>{props.extra}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
