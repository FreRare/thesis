import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";
import strings from "../../config/strings";
import RegistrationForm from "../components/RegistrationForm";
import User from "../models/User";

interface WelcomeScreenProps {
  navigation: any;
  route: any;
  setUser: (u: User | undefined | null) => void;
}

function WelcomeScreen(props: WelcomeScreenProps) {
  const [isLogin, setIsLogin] = React.useState<boolean>(true);

  const welcomeImageUri = require("../../assets/ATC_app_welcome_screen_picture.jpg");
  return (
    <Layout navigation={props.route} shouldDisplayMenuBar={false}>
      <ImageBackground style={styles.backgroundImage} source={welcomeImageUri}>
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
