import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../constants/theme";
const screenWidth = Dimensions.get("screen").width;

export const styles = StyleSheet.create({
  container: { padding: 20 },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContainer: {
    backgroundColor: colors.darkBlue,
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth - 40,
    paddingHorizontal: 20,
    height: 50,
  },
  buttonText: { color: colors.white, fontWeight: "600" },
  loadingContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});
