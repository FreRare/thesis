import React from "react";
import { View, Button, Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import colors from "../../config/colors";
import strings from "../../config/strings";
import { TouchableHighlight, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "react-native";
import { TouchableOpacity } from "react-native";

interface MenuBarProps {
  navigation: any;
  activeScreen: string;
}

/**
 *
 * @param props Should give it the navigation prop so it can navigate properly
 * @returns The menu bar used to navigate between pages for an authenticated user
 */
function MenuBar(props: MenuBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={
          props.activeScreen === strings.aquariums
            ? styles.activeTouchable
            : styles.touchable
        }
        onPress={() => props.navigation.navigate(strings.aquariums)}
      >
        <Icon name="dotchart" size={30} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={
          props.activeScreen === strings.configs
            ? styles.activeTouchable
            : styles.touchable
        }
        onPress={() => props.navigation.navigate(strings.configs)}
      >
        <Icon name="tool" size={30} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={
          props.activeScreen === strings.home
            ? styles.activeTouchable
            : styles.touchable
        }
        onPress={() => props.navigation.navigate(strings.home)}
      >
        <Icon name="home" size={30} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={
          props.activeScreen === strings.statistics
            ? styles.activeTouchable
            : styles.touchable
        }
        onPress={() => props.navigation.navigate(strings.statistics)}
      >
        <Icon name="barchart" size={30} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={
          props.activeScreen === strings.profile
            ? styles.activeTouchable
            : styles.touchable
        }
        onPress={() => props.navigation.navigate(strings.profile)}
      >
        <Icon name="user" size={30} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.menuBarBackground,
    flexDirection: "row",
    alignContent: "flex-end",
    width: "100%",
    height: 80,
    padding: 5,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    borderTopColor: colors.menuTopBorder,
    borderStartColor: colors.menuTopBorder,
    borderEndColor: colors.menuTopBorder,
    borderTopWidth: 3,
    borderStartWidth: 1,
    borderEndWidth: 1,
  },
  touchable: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 6,
    marginRight: 6,
    borderWidth: 2,
    padding: 3,
    borderRadius: 100,
    borderColor: colors.menuBorder,
  },
  activeTouchable: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    flex: 2.5,
    marginLeft: 6,
    marginRight: 6,
    borderWidth: 2,
    padding: 3,
    borderRadius: 100,
    borderColor: colors.menuHighlightBorder,
    backgroundColor: colors.menuHighlightBG,
  },
});

export default MenuBar;
