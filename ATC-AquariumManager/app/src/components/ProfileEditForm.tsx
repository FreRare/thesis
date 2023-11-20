import React from "react";
import User from "../models/User";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import commonStyles from "../utils/commonStyles";
import strings from "../../config/strings";
import colors from "../../config/colors";

type ProfileEditFormProps = {
  user: User;
  callback: (u: User | undefined) => void;
};

function ProfileEditForm(props: ProfileEditFormProps) {
  const [firstName, setFirstName] = React.useState<string>(
    props.user.firstName
  );
  const [lastName, setLastName] = React.useState<string>(props.user.lastName);
  const [email, setEmail] = React.useState<string>(props.user.email);

  const handleSubmit = () => {
    props.user.firstName = firstName;
    props.user.lastName = lastName;
    props.user.email = email;
    props.callback(props.user);
  };

  const handleCancel = () => {
    props.callback(undefined);
  };

  return (
    <View style={styles.container}>
      <Text>Edit profile</Text>
      <View style={commonStyles.vertical}>
        <Text>{strings.editFirstNameLabel}</Text>
        <TextInput
          style={commonStyles.input}
          value={firstName}
          onChangeText={(t: string) => {
            setFirstName(t);
          }}
          autoCapitalize="words"
        />
      </View>
      <View style={commonStyles.vertical}>
        <Text>{strings.editLastNameLabel}</Text>
        <TextInput
          style={commonStyles.input}
          value={lastName}
          onChangeText={(t: string) => {
            setLastName(t);
          }}
          autoCapitalize="words"
        />
      </View>
      <View style={commonStyles.vertical}>
        <Text>{strings.editEmailLabel}</Text>
        <TextInput
          style={commonStyles.input}
          value={email}
          onChangeText={(t: string) => {
            setEmail(t);
          }}
          autoCapitalize="none"
        />
      </View>
      <View style={commonStyles.horizontal}>
        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text>{strings.confirm}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleCancel()}>
          <Text>{strings.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "65%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    padding: 15,
    borderRadius: 20,
    borderColor: colors.primary,
    backgroundColor: colors.formBackround,
  },
  button: {
    flex: 1,
    borderColor: colors.primary,
    borderWidth: 4,
    borderRadius: 50,
    backgroundColor: colors.menuBarBackground,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 10,
  },
});

export default ProfileEditForm;
