import { View, ScrollView, Text, Dimensions, StyleSheet } from "react-native";
import React from "react";
import Layout from "../components/Layout";
import colors from "../../config/colors";

type AquariumsScreenProps = {
  navigation: any;
};

function AquariumsScreen(props: AquariumsScreenProps) {
  const aqauariumCards = [
    "My 1st aquarium",
    "My 2nd aquarium",
    "My 3rd aquarium",
    "My 4th aquarium",
  ].map((item, index) => {
    return (
      <View key={index} style={styles.card}>
        <Text>{item}</Text>
      </View>
    );
  });

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <ScrollView contentContainerStyle={styles.container}>
        {aqauariumCards}
      </ScrollView>
    </Layout>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    height: 200,
    width: "100%",
    borderWidth: 5,
    borderColor: colors.black,
    borderRadius: 30,
    margin: 10,
    padding: 20,
  },
});

export default AquariumsScreen;
