import React, { ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MenuBar from "./MenuBar";
import colors from "../../config/colors";

/**@type {LayoutComponentProps} - The properties of the Layout component*/
type LayoutComponentProps = {
  children: ReactNode;
  navigation: any;
  shouldDisplayMenuBar: boolean;
};

/**
 * This component gives a basic and
 * @param {LayoutComponentProps} props - The properties to operate this object
 * @returns The children properties wrapped inside the layout
 */
function Layout(props: LayoutComponentProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <KeyboardAvoidingView style={styles.layout}>
          {props.shouldDisplayMenuBar && (
            <MenuBar navigation={props.navigation} />
          )}
          {props.children}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    marginTop: Platform.OS === "android" ? 30 : 0,
    paddingBottom: 80,
    backgroundColor: colors.background,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    zIndex: 0,
  },
});
export default Layout;
