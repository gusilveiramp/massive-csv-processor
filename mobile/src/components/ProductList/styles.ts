import { StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  flatlistContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  footer: { padding: 16 },
  noProductsFoundText: { textAlign: "center", color: colors.lightBlue },
  activityIndicator: { margin: 16 },
});
