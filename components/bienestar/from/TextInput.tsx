import {
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

import { Colors } from "@/constants/bienestar/colors";
import { Text } from "@/components/bienestar/primitives/Text";

export interface TextInputProps extends TextInputNativeProps {
  color?: keyof typeof Colors;
}

export function TextInput({ color = "accent", ...props }: TextInputProps) {
  return (
    <TextInputNative
      {...props}
      style={{
        borderColor: Colors[color],
        color:
          Colors[["primary", "secondary"].includes(color) ? color : "text"],
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        fontSize: 14,
      }}
    />
  );
}

/**
 * Props for the Text Input Controller component.
 *
 * The typing of the props is a duplicate of the original source code.
 */
export interface TextInputControllerProps<
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>
> extends Omit<ControllerNativeProps<T, N>, "render"> {
  inputProps: TextInputProps;
  errors: FieldErrors<T>;
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

/**
 * Wrapper around the TextInput Controller component.
 * The typing of the component is a duplicate of the original source code.
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
        <View>
          <TextInput
            {...inputProps}
            color={controllerError.error ? "secondary" : "accent"}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
          {controllerError.error && (
            <Text color="secondary">{controllerError.message}</Text>
          )}
        </View>
      )}
    />
  );
}
