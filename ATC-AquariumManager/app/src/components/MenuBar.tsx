import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import colors from "../../config/colors";
import strings from "../../config/strings";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { Menu, MenuItem } from "react-native-material-menu";
import NavigationScreens from "../utils/NavigationScreens";

/**
 * This is the top menuBar, for additional sites like profile, settings and info
 * @param props Should give it the navigation prop so it can navigate properly
 * @returns The menu bar used to navigate between pages for an authenticated user
 */

type MenuBarProps = {
  navigation: any;
};

function MenuBar(props: MenuBarProps) {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const showMenu = () => setMenuVisible(true);

  const hideMenu = () => setMenuVisible(false);

  const topNavItems = NavigationScreens.filter(
    (val: any) => !val.displayOnBottom
  );

  const menuItems = topNavItems.map((item, index) => {
    return (
      <MenuItem
        key={index}
        onPress={() => {
          hideMenu;
          props.navigation.navigate(item.name);
        }}
      >
        <Icon name={item.icon} size={20} />
        <View style={{ paddingHorizontal: 10 }}>
          <Text>{item.title}</Text>
        </View>
      </MenuItem>
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.projetName}</Text>
      <Menu
        visible={menuVisible}
        anchor={
          <TouchableOpacity onPress={showMenu}>
            <Icon name="bars" size={30} />
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}
      >
        {menuItems}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 20,
    flexDirection: "row",
    height: 60,
    width: "100%",
    backgroundColor: colors.menuBarBackground,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    marginRight: 100,
    fontSize: 20,
  },
});

export default MenuBar;
