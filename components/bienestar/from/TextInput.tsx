import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput as TextInputNative,
  TextInputProps as TextInputNativeProps,
  View,
} from "react-native";
import {
  Controller as ControllerNative,
  ControllerProps as ControllerNativeProps,
  FieldErrors,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/bienestar/colors";
import { Text } from "@/components/bienestar/primitives/Text";

export interface TextInputProps extends TextInputNativeProps {
  color?: keyof typeof Colors;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  isPassword?: boolean;
}

export function TextInput({
  color = "accent",
  style,
  multiline,
  leftIcon,
  isPassword = false,
  secureTextEntry,
  ...props
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = isPassword ? !showPassword : secureTextEntry;

  return (
    <View
      style={[
        styles.inputContainer,
        {
          borderColor: color === "secondary" ? Colors.secondary : "#CBD5E1",
          minHeight: multiline ? 90 : 50,
        },
      ]}
    >
      {leftIcon && (
        <View style={styles.iconBox}>
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={color === "secondary" ? Colors.secondary : "#64748B"}
          />
        </View>
      )}

      <TextInputNative
        {...props}
        multiline={multiline}
        secureTextEntry={isSecure}
        placeholderTextColor="#94A3B8"
        style={[
          styles.nativeInput,
          {
            color: Colors.text,
          },
          style,
        ]}
      />

      {isPassword && (
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconBoxRight}
        >
          <MaterialCommunityIcons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#64748B"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  iconBox: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxRight: {
    padding: 6,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  nativeInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
  },
});

/**
 * Props for the Text Input Controller component.
 */
export interface TextInputControllerProps<
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>
> extends Omit<ControllerNativeProps<T, N>, "render"> {
  inputProps: TextInputProps;
  errors: FieldErrors<T>;
}

/**
 * Utility type for error resolution.
 */
type ControllerError =
  | {
      error: true;
      message: string;
    }
  | {
      error: false;
    };

/**
 * Wrapper around the TextInput Controller component.
 */
export function TextInputController<
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>
>({ inputProps, errors, ...props }: TextInputControllerProps<T, N>) {
  const controllerError: ControllerError = errors[props.name]?.message
    ? {
        error: true,
        message: errors[props.name]?.message as string,
      }
    : {
        error: false,
      };

  return (
    <ControllerNative
      {...props}
      render={({ field: { value, onChange, onBlur } }) => (
        <View style={{ width: "100%" }}>
          <TextInput
            {...inputProps}
            color={controllerError.error ? "secondary" : "accent"}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
          {controllerError.error && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4, marginLeft: 2 }}>
              <MaterialCommunityIcons name="alert-circle-outline" size={14} color={Colors.secondary} />
              <Text color="secondary" style={{ fontSize: 12 }}>
                {controllerError.message}
              </Text>
            </View>
          )}
        </View>
      )}
    />
  );
}
