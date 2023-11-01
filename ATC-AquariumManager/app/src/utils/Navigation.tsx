import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../views/WelcomeScreen";
import HomeScreen from "../views/HomeScreen";
import strings from "../../config/strings";
import useUser from "./hooks/useUser";
import ProfileScreen from "../views/ProfileScreen";

const Stack = createStackNavigator();

function Navigation() {
  const [user, setUser] = useUser();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name={strings.home} initialParams={{ user: user }}>
              {(props: any) => <HomeScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name={strings.profile} initialParams={{ user: user }}>
              {(props: any) => <ProfileScreen {...props} setUser={setUser} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name={strings.welcome} initialParams={{ user: user }}>
              {(props: any) => <WelcomeScreen {...props} setUser={setUser} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
