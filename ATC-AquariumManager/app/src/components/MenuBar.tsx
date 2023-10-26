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
}

/**
 *
 * @param props Should give it the navigation prop so it can navigate properly
 * @returns The menu bar used to navigate between pages for an authenticated user
 */
function MenuBar(props: MenuBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.sideButtonsContainer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => props.navigation.navigate(strings.aquariums)}
        >
          <Icon name="dotchart" size={30} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => props.navigation.navigate(strings.configs)}
        >
          <Icon name="tool" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.homeButtonContainer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => props.navigation.navigate(strings.home)}
        >
          <Icon name="home" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.sideButtonsContainer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => props.navigation.navigate(strings.profile)}
        >
          <Icon name="user" size={30} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => props.navigation.navigate(strings.statistics)}
        >
          <Icon name="barchart" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
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
  },
  touchable: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 2,
    padding: 3,
    borderRadius: 100,
    borderColor: colors.textSecondary,
  },
  homeButtonContainer: {
    flex: 1,
  },
  sideButtonsContainer: {
    flex: 1,
    flexDirection: "row",
  },
});

export default MenuBar;
