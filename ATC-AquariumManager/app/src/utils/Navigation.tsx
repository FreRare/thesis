import React, { ReactElement } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WelcomeScreen from "../views/WelcomeScreen";
import strings from "../../config/strings";
import colors from "../../config/colors";
import useUser from "./hooks/useUser";
import Icon from "react-native-vector-icons/AntDesign";
import NavigationScreens from "./NavigationScreens";
import MenuBarButton from "../components/MenuBarButton";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Navigation() {
  const [user, setUser] = useUser();

  const loginRequredTabs = NavigationScreens.map((item, index) => {
    return (
      <Tab.Screen
        key={index}
        name={item.name}
        initialParams={{ user: user }}
        // component={item.component as (props: any) => ReactElement<any, any>}
        children={(props: any) => (
          <item.component {...props} setUser={setUser} />
        )}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon name={item.icon as string} size={30} color={color} />
          ),
          tabBarButton: (props: any) => (
            <MenuBarButton {...props} item={item} />
          ),
        }}
      />
    );
  });

  return (
    <Tab.Navigator
      initialRouteName={strings.home}
      screenOptions={{
        headerShown: false,
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
      }}
    >
      {user ? (
        loginRequredTabs
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

export default Navigation;
