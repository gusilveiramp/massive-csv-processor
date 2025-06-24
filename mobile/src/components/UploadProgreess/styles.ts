import { StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    textAlign: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
  },
  success: {
    color: colors.lightBlue,
  },
  uploadingText: {
    paddingBottom: 8,
    textAlign: "center",
    color: colors.lightBlue,
  },
});
