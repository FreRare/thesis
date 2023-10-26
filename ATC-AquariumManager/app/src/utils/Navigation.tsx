import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../views/WelcomeScreen";
import HomeScreen from "../views/HomeScreen";
import strings from "../../config/strings";

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={strings.welcome}>
        <Stack.Screen name={strings.welcome} component={WelcomeScreen} />
        <Stack.Screen name={strings.home} component={HomeScreen} />
        <Stack.Screen name={strings.login} component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
