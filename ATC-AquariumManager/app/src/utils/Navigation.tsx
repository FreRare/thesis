import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WelcomeScreen from "../views/WelcomeScreen";
import strings from "../../config/strings";
import colors from "../../config/colors";
import MenuBarButton from "../components/MenuBarButton";
import { StyleSheet } from "react-native";
import NavigationScreens from "./NavigationScreens";
import User from "../models/User";

type NavigationProps = {
  user: User | undefined;
  setUser: (u: User | undefined | null) => void;
  isUserLoaded: boolean;
};

const Tab = createBottomTabNavigator();

function Navigation(propsog: NavigationProps) {
  const bottomNav = NavigationScreens.map((item, index) => {
    return (
      <Tab.Screen
        key={index}
        name={item.name}
        children={(props: any) => (
          <item.component
            {...props}
            user={propsog.user}
            setUser={propsog.setUser}
          />
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
      {propsog.user ? (
        bottomNav
      ) : (
        <>
          <Tab.Screen
            name={strings.welcome}
            initialParams={{ user: propsog.user }}
            options={{
              tabBarStyle: { display: "none", marginBottom: -2000 },
            }}
          >
            {(props: any) => (
              <WelcomeScreen
                {...props}
                setUser={propsog.setUser}
                isUserLoadFinished={propsog.isUserLoaded}
              />
            )}
          </Tab.Screen>
        </>
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    paddingHorizontal: 10,
    height: 69,
    position: "absolute",
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    borderTopColor: colors.darkPrimary,
    borderStartColor: colors.darkPrimary,
    borderEndColor: colors.darkPrimary,
    borderTopWidth: 3,
    borderStartWidth: 1,
    borderEndWidth: 1,
    backgroundColor: colors.menuBarBackground,
  },
});

export default Navigation;
