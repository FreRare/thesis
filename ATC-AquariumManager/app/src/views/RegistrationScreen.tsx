import { StyleSheet, ImageBackground } from "react-native";
import React from "react";
import RegistrationForm from "../components/RegistrationForm";
import Layout from "../components/Layout";
import strings from "../../config/strings";

interface RegistrationScreenProps {
  navigation: any;
}

function RegistrationScreen(props: RegistrationScreenProps) {
  const welcomeImageUri = require("../../assets/ATC_app_welcome_screen_picture.jpg");
  return (
    <Layout
      navigation={props.navigation}
      shouldDisplayMenuBar={false}
      activeScreen={strings.registration}
    >
      <ImageBackground style={styles.backgroundImage} source={welcomeImageUri}>
        <RegistrationForm navigation={props.navigation}></RegistrationForm>
      </ImageBackground>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default RegistrationScreen;
