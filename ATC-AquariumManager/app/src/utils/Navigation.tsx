import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WelcomeScreen from "../views/WelcomeScreen";
import strings from "../../config/strings";
import colors from "../../config/colors";
import useUser from "./hooks/useUser";
import MenuBarButton from "../components/MenuBarButton";
import { StyleSheet } from "react-native";
import NavigationScreens from "./NavigationScreens";

const Tab = createBottomTabNavigator();

function Navigation() {
  const [user, setUser] = useUser();

  const bottomNav = NavigationScreens.map((item, index) => {
    return (
      <Tab.Screen
        key={index}
        name={item.name}
        children={(props: any) => (
          <item.component {...props} user={user} setUser={setUser} />
        )}
        options={{
          tabBarStyle: styles.tabBarStyle,
          tabBarShowLabel: false,
          tabBarButton: (props: any) => (
            <MenuBarButton {...props} item={item} />
          ),
        }}
      />
    );
  });
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        bottomNav
      ) : (
        <>
          <Tab.Screen
            name={strings.welcome}
            initialParams={{ user: user }}
            options={{
              tabBarStyle: { display: "none" },
            }}
          >
            {(props: any) => <WelcomeScreen {...props} setUser={setUser} />}
          </Tab.Screen>
        </>
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    paddingHorizontal: 10,
    height: 80,
    position: "absolute",
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    borderTopColor: colors.menuTopBorder,
    borderStartColor: colors.menuTopBorder,
    borderEndColor: colors.menuTopBorder,
    borderTopWidth: 3,
    borderStartWidth: 1,
    borderEndWidth: 1,
    backgroundColor: colors.menuBarBackground,
  },
});

export default Navigation;
