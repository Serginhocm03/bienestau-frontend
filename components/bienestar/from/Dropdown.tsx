import { Dropdown as DropdownNative } from "react-native-element-dropdown";
import { DropdownProps as DropdownNativeProps } from "react-native-element-dropdown/lib/typescript/components/Dropdown/model";
import {
  Controller as ControllerNative,
  ControllerProps as ControllerNativeProps,
  FieldErrors,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { View } from "react-native";

import { Colors } from "@/constants/bienestar/colors";
import { Text } from "@/components/bienestar/primitives/Text";

export interface DropdownProps<T> extends DropdownNativeProps<T> {
  color?: keyof typeof Colors;
}

export function Dropdown<T>({ color = "accent", ...props }: DropdownProps<T>) {
  return (
    <DropdownNative
      {...props}
      style={{
        borderColor: Colors[color],
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 10,
      }}
      selectedTextStyle={{
        color:
          Colors[["primary", "secondary"].includes(color) ? color : "text"],
        fontSize: 14,
      }}
      placeholderStyle={{
        color: Colors.accent,
        fontSize: 14,
      }}
    />
  );
}

export interface DropdownControllerProps<
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>
> extends Omit<ControllerNativeProps<T, N>, "render"> {
  data: { label: string; value: string }[];
  placeholder?: string;
  errors: FieldErrors<T>;
  color?: keyof typeof Colors;
}

/**
 * This type is a utility to assist the typing system.
 */
type ControllerError =
  | {
      error: true;
      message: string;
    }
  | {
      error: false;
    };

export function DropdownController<
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>
>({
  data,
  errors,
  placeholder,
  color = "accent",
  ...props
}: DropdownControllerProps<T, N>) {
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
        <View>
          <Dropdown
            labelField="label"
            valueField="value"
            value={value}
            onChange={(data) => onChange(data.value)}
            onBlur={onBlur}
            data={data}
            placeholder={placeholder}
          />
          {controllerError.error && (
            <Text color="secondary">{controllerError.message}</Text>
          )}
        </View>
      )}
    />
  );
}
