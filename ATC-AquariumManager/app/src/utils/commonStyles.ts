import { StyleSheet } from "react-native";
import colors from "../../config/colors";

const commonStyles = StyleSheet.create({
  input: {
    flex: 1,
    minWidth: "40%",
    maxWidth: "80%",
    padding: 10,
    margin: "5%",
    backgroundColor: colors.menuBarBackground,
    maxHeight: 50,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button: {
    borderColor: colors.primary,
    borderWidth: 4,
    borderRadius: 50,
    backgroundColor: colors.menuBarBackground,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "40%",
    maxWidth: "60%",
    padding: 10,
    margin: 10,
  },
  dropdownListBoxStyle: {
    backgroundColor: colors.menuBarBackground,
    width: 300,
  },
  dropdownListInputStyle: {
    color: colors.black,
  },
  dropdownListDropdownStyles: {
    backgroundColor: colors.menuBarBackground,
    opacity: 1,
  },
  horizontal: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  vertical: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  formContainer: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.menuTopBorder,
    borderWidth: 3,
    borderRadius: 20,
    position: "absolute",
    padding: 10,
    backgroundColor: colors.background,
  },
});

export default commonStyles;
