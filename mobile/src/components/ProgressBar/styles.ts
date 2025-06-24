import { StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.blue,
  },
  progressText: {
    position: "absolute",
    alignSelf: "center",
    fontWeight: "bold",
    color: "#333",
    fontSize: 12,
  },
});
