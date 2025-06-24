import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../constants/theme";
const screenWidth = Dimensions.get("screen").width;

export const styles = StyleSheet.create({
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContainer: {
    backgroundColor: colors.lightPurple,
    borderColor: colors.lightPurple,
    borderWidth: 2,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth - 40,
    paddingHorizontal: 20,
    height: 50,
  },
  buttonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
