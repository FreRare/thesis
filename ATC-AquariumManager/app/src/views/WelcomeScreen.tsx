import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";
import RegistrationForm from "../components/RegistrationForm";
import User from "../models/User";

type WelcomeScreenProps = {
  navigation: any;
  setUser: (u: User | undefined | null) => void;
};

/**
 * This component is th efirst screen the user sees when opening the app and isn't logged in.
 * Have both login and registration form handled inside.
 * @param props The properties so the component can work
 * @returns A form for logina dn two buttons where you can log in or change to registration form
 */
function WelcomeScreen(props: WelcomeScreenProps) {
  const [isLogin, setIsLogin] = React.useState<boolean>(true); // Flag to show login form
  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={false}>
      <View style={styles.backgroundImage}>
        {isLogin && <Logo />}
        {isLogin && (
          <LoginForm
            navigation={props.navigation}
            setUser={props.setUser}
            setIsLogin={setIsLogin}
          />
        )}
        {!isLogin && (
          <RegistrationForm
            navigation={props.navigation}
            setUser={props.setUser}
            setIsLogin={setIsLogin}
          />
        )}
      </View>
    </Layout>
  );
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    width: windowWidth,
    height: windowHeight,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default WelcomeScreen;
