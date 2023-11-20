import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import Layout from "../components/Layout";
import User from "../models/User";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../config/colors";
import strings from "../../config/strings";
import ProfileEditForm from "../components/ProfileEditForm";
import PasswordChangeForm from "../components/PasswordChangeForm";

interface ProfileScreenProps {
  navigation: any;
  user: User;
  setUser: (u: User | undefined | null) => void;
}

function ProfileScreen(props: ProfileScreenProps) {
  const [editProfile, setEditProfile] = React.useState<boolean>(false);
  const [changePassword, setChangePassword] = React.useState<boolean>(false);

  const handleLogout = () => {
    props.setUser(null);
  };

  /**
   * Handles the edit profile form's submission or cancel
   * @param user The user given to the callback, undefined on cancel
   */
  const handleEditProfile = (user: User | undefined) => {
    setEditProfile(false);
    if (user === undefined) {
      return;
    }
    // Edit user data
  };

  /**
   * Handles the password changer form submit or cancel
   * @param newPass The new password, undefined on cancel
   */
  const handleChangePassword = (newPass: string | undefined) => {
    setChangePassword(false);
    if (newPass === undefined) {
      return;
    }
    // Change password
  };

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <View
        style={[
          styles.container,
          { opacity: editProfile || changePassword ? 0.1 : 1 },
        ]}
      >
        <View style={styles.iconContainer}>
          <Icon name="user-circle-o" size={100} />
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>{props.user.name}</Text>
          <Text style={styles.dataText}>{props.user.email}</Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            disabled={editProfile || changePassword}
            style={[styles.button, { borderColor: colors.secondary }]}
            onPress={() => {
              if (!editProfile && !changePassword) setEditProfile(true);
            }}
          >
            <Text style={styles.dataText}>{strings.editProfileData}</Text>
            <Icon
              name="edit"
              size={20}
              style={{ marginLeft: 10, color: colors.secondary }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={editProfile || changePassword}
            style={[styles.button, { borderColor: colors.secondary }]}
            onPress={() => {
              if (!editProfile && !changePassword) setChangePassword(true);
            }}
          >
            <Text style={styles.dataText}>{strings.changePassword}</Text>
            <Icon
              name="edit"
              size={20}
              style={{ marginLeft: 10, color: colors.secondary }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={editProfile || changePassword}
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
      </View>
      {editProfile && (
        <ProfileEditForm user={props.user} callback={handleEditProfile} />
      )}
      {changePassword && <PasswordChangeForm />}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 100,
  },
});

export default ProfileScreen;
