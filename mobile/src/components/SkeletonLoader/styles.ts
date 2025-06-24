import { StyleSheet } from "react-native";
import { colors } from "../../constants/theme"; // ajuste o path conforme sua estrutura

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "100%",
  },
  card: {
    marginBottom: 20,
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
    overflow: "hidden",
    padding: 16,
  },
  shimmerWrapper: {
    height: 20,
    backgroundColor: colors.grey,
    overflow: "hidden",
    borderRadius: 4,
    marginBottom: 10,
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.darkBlue,
    opacity: 0.3,
  },
});
