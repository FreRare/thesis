import React from "react";
import {
  ImageBackground,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import MenuBar from "../components/MenuBar";
import Layout from "../components/Layout";
import strings from "../../config/strings";
import colors from "../../config/colors";
import { TextInput } from "react-native";
import LoginForm from "../components/LoginForm";

interface WelcomeScreenProps {
  navigation: any;
}

function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const welcomeImageUri = require("../../assets/ATC_app_welcome_screen_picture.jpg");
  return (
    <Layout navigation={navigation}>
      <ImageBackground style={styles.backgroundImage} source={welcomeImageUri}>
        <LoginForm navigation={navigation}></LoginForm>
      </ImageBackground>
    </Layout>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    // flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WelcomeScreen;
