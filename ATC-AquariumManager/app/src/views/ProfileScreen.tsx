import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import Layout from "../components/Layout";
import strings from "../../config/strings";
import User from "../models/User";

interface ProfileScreenProps {
  navigation: any;
  route: any;
  setUser: (u: User | undefined | null) => void;
}

function ProfileScreen(props: ProfileScreenProps) {
  const handleLogout = () => {
    props.setUser(null);
  };

  return (
    <Layout
      navigation={props.navigation}
      shouldDisplayMenuBar={true}
      activeScreen={strings.profile}
    >
      <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  button: {
    margin: 30,
    padding: 30,
    backgroundColor: "red",
  },
});

export default ProfileScreen;
