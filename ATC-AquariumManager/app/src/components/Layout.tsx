import React, { ReactNode } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import MenuBar from "./MenuBar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../config/colors";

interface LayoutComponentProps {
  children: ReactNode;
  navigation: any;
  shouldDisplayMenuBar: boolean;
}

function Layout(props: LayoutComponentProps) {
  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.layout}
      scrollEnabled={false}
    >
      {props.children}
      {props.shouldDisplayMenuBar && (
        <MenuBar navigation={props.navigation}></MenuBar>
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: colors.primary,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});
export default Layout;
