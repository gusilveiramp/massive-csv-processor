import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../constants/theme";
const screenWidth = Dimensions.get("screen").width;

export const styles = StyleSheet.create({
  input: {
    height: 50,
    width: screenWidth - 40,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    color: colors.darkBlue,
  },
});
