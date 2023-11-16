import React from "react";
import { Dimensions, ImageBackground, StyleSheet } from "react-native";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";
import RegistrationForm from "../components/RegistrationForm";
import User from "../models/User";

interface WelcomeScreenProps {
  navigation: any;
  setUser: (u: User | undefined | null) => void;
}

function WelcomeScreen(props: WelcomeScreenProps) {
  const [isLogin, setIsLogin] = React.useState<boolean>(true);

  const welcomeImageUri = require("../../assets/ATC_app_welcome_screen_picture.jpg");
  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={false}>
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
