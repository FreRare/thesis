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

interface LayoutComponentProps {
  children: ReactNode;
  navigation: any;
  shouldDisplayMenuBar: boolean;
}

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
