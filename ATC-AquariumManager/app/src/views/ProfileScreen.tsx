import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import Layout from "../components/Layout";
import User from "../models/User";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../config/colors";
import strings from "../../config/strings";
import commonStyles from "../utils/commonStyles";

interface ProfileScreenProps {
  navigation: any;
  user: User;
  setUser: (u: User | undefined | null) => void;
}

function ProfileScreen(props: ProfileScreenProps) {
  const handleLogout = () => {
    props.setUser(null);
  };

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <View style={styles.iconContainer}>
        <Icon name="user-circle-o" size={100} />
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>{props.user.name}</Text>
        <Text style={styles.dataText}>{props.user.email}</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { borderColor: colors.secondary }]}
          onPress={() => console.log("Edit profile")}
        >
          <Text style={styles.dataText}>{strings.editProfileData}</Text>
          <Icon
            name="edit"
            size={20}
            style={{ marginLeft: 10, color: colors.secondary }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { borderColor: "red" }]}
          onPress={handleLogout}
        >
          <Text style={styles.dataText}>{strings.logout}</Text>
          <Icon
            name="sign-out"
            size={20}
            style={{ marginLeft: 10, color: "red" }}
          />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dataContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginTop: 30,
  },
  dataText: {
    fontSize: 20,
    marginVertical: 10,
  },
  button: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.menuBarBackground,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 20,
  },
  buttons: {
    flex: 1,
    bottom: 0,
  },
});

export default ProfileScreen;
