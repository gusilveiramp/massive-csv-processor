import { StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: colors.grey,
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: colors.lightPurple,
    fontWeight: "bold",
    marginVertical: 6,
  },
  expiration: {
    fontSize: 12,
    color: colors.lightBlue,
    marginTop: 4,
  },
  exchangeRateContainer: {
    marginTop: 10,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    rowGap: 1,
    columnGap: 5,
  },
  exchangeRateText: {
    fontSize: 12,
    color: colors.white,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.darkBlue,
    backgroundColor: colors.darkBlue,
    borderRadius: 20,
    marginVertical: 2,
  },
});
