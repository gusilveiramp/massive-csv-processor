import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleProp,
  View,
  ViewStyle,
  GestureResponderEvent,
} from "react-native";

import { colors } from "../../constants/theme";
import { styles } from "./styles";

interface AppButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        (disabled || loading) && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Loading...</Text>
        </View>
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
