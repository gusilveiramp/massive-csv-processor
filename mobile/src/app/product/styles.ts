import { StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue, // se você tiver definido isso no theme
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    position: "absolute",
    top: 0,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: { color: colors.white },
  inputLabel: {
    color: colors.white,
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 30,
    gap: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  deleteText: {
    color: colors.red,
    fontSize: 16,
  },
});

export default styles;
