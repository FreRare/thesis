import React, { ReactNode } from "react";
import { Platform, StyleSheet, SafeAreaView } from "react-native";
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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.layout}
        scrollEnabled={false}
      >
        {props.shouldDisplayMenuBar && (
          <MenuBar navigation={props.navigation} />
        )}
        {props.children}
      </KeyboardAwareScrollView>
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
  },
});
export default Layout;
