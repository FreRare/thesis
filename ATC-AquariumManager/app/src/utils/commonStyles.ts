import { StyleSheet, Dimensions } from "react-native";
import colors from "../../config/colors";

const windowWidth = Dimensions.get("window").width;

const commonStyles = StyleSheet.create({
  input: {
    flex: 1,
    width: "80%",
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
    marginBottom: 10,
    marginTop: 20,
  },
  dropdownListInputStyle: {
    color: colors.black,
  },
  dropdownListDropdownStyles: {
    backgroundColor: colors.menuBarBackground,
    opacity: 1,
    height: 100,
    zIndex: 999,
    position: "relative",
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
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  formContainer: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.secondary,
    borderWidth: 3,
    borderRadius: 20,
    position: "absolute",
    padding: 7,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: -25,
    flexGrow: 1,
    paddingBottom: 60,
  },
});

export default commonStyles;
