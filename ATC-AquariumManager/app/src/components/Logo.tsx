import React from "react";
import { Image, StyleSheet } from "react-native";

function Logo() {
  const logoImg = require("../../assets/ATC_logo_8.png");
  return <Image source={logoImg} style={styles.logo} />;
}

const styles = StyleSheet.create({
  logo: {
    width: 160,
    height: 160,
    marginTop: 30,
  },
});

export default Logo;
