import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import MenuBar from "./MenuBar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../config/colors";
import { SafeAreaView } from "react-navigation";

interface LayoutComponentProps {
  children: ReactNode;
  navigation: any;
  shouldDisplayMenuBar: boolean;
  activeScreen: string;
}

function Layout(props: LayoutComponentProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.layout}
        scrollEnabled={false}
      >
        {props.children}
        {false && (
          <MenuBar
            navigation={props.navigation}
            activeScreen={props.activeScreen}
          ></MenuBar>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: colors.background,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});
export default Layout;
