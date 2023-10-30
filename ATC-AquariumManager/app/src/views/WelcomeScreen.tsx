import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";
import strings from "../../config/strings";
import User from "../models/User";
import useUser from "../utils/hooks/useUser";
import RegistrationForm from "../components/RegistrationForm";

interface WelcomeScreenProps {
  navigation: any;
}

function WelcomeScreen(props: WelcomeScreenProps) {
  const [isLogin, setIsLogin] = React.useState<boolean>(true);
  const [user, setUser] = useUser();
  if (user instanceof User) {
    // If we have a saved user redirect to home
    props.navigation.navigate(strings.home);
  }

  const welcomeImageUri = require("../../assets/ATC_app_welcome_screen_picture.jpg");
  return (
    <Layout
      navigation={props.navigation}
      shouldDisplayMenuBar={false}
      activeScreen={strings.welcome}
    >
      <ImageBackground style={styles.backgroundImage} source={welcomeImageUri}>
        {isLogin && <Logo />}
        {isLogin && (
          <LoginForm
            navigation={props.navigation}
            setUser={setUser}
            setIsLogin={setIsLogin}
          />
        )}
        {!isLogin && (
          <RegistrationForm
            navigation={props.navigation}
            setUser={setUser}
            setIsLogin={setIsLogin}
          />
        )}
      </ImageBackground>
    </Layout>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default WelcomeScreen;
