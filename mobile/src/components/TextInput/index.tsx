import React from "react";

import { colors } from "../../constants/theme";
import { TextInput, TextInputProps } from "react-native";
import { styles } from "./styles";

export default function AppTextInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.grey}
    />
  );
}
