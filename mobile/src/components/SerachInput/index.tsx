import React from "react";
import { TextInput, View } from "react-native";
import { styles } from "./styles";
import { colors } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchInput({ value, onChangeText }: SearchInputProps) {
  return (
    <View>
      <Ionicons
        name="search"
        size={24}
        color={colors.lightPurple}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        placeholder="Search products..."
        placeholderTextColor={colors.grey}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
