import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";

interface WelcomeScreenProps {
  navigation: any;
}

function WelcomeScreen(props: WelcomeScreenProps) {
  const welcomeImageUri = require("../../assets/ATC_app_welcome_screen_picture.jpg");
  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={false}>
      <ImageBackground style={styles.backgroundImage} source={welcomeImageUri}>
        <Logo />
        <LoginForm navigation={props.navigation} />
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
