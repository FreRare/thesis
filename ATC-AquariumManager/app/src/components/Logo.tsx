import React from "react";
import { Image, StyleSheet } from "react-native";

function Logo() {
  const logoImg = require("../../assets/ATC_logo_6.png");
  return <Image source={logoImg} style={styles.logo} />;
}

const styles = StyleSheet.create({
  logo: {
    width: 140,
    height: 140,
    marginTop: 20,
    borderRadius: 30,
  },
});

export default Logo;
