import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import colors from "../../config/colors";

function LoadingAnimation() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={120} color={colors.loadinAnimationColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
    borderRadius: 50,
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});

export default LoadingAnimation;
