import React from "react";
import { Image, StyleSheet } from "react-native";

function Logo() {
  const logoImg = require("../../assets/ATC_logo_1.png");
  return <Image source={logoImg} style={styles.logo} />;
}

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 120,
    marginTop: 20,
    borderRadius: 30,
  },
});

export default Logo;
