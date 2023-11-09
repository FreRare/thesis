import { StyleSheet } from "react-native";
import colors from "../../config/colors";

const commonStyles = StyleSheet.create({
  input: {
    flex: 1,
    width: "90%",
    padding: 10,
    margin: "5%",
    backgroundColor: colors.menuBarBackground,
    maxHeight: 50,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
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
    zIndex: 99,
  },
});

export default commonStyles;
