import React from "react";
import User from "../models/User";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import commonStyles from "../utils/commonStyles";
import strings from "../../config/strings";
import colors from "../../config/colors";

type ProfileEditFormProps = {
  user: User;
  callback: (u: User | undefined, oldMail?: string) => void;
};

function ProfileEditForm(props: ProfileEditFormProps) {
  const [firstName, setFirstName] = React.useState<string>(
    props.user.firstName
  );
  const [lastName, setLastName] = React.useState<string>(props.user.lastName);
  const [email, setEmail] = React.useState<string>(props.user.email);
  const [error, setError] = React.useState<string>("");

  /**
   * Validates the inputs for length and for email format
   * Calls the callback with the necessary arguments
   */
  const handleSubmit = () => {
    if (firstName.length <= 0 || lastName.length <= 0 || email.length <= 0) {
      setError(strings.PROFILE.emptyInputMessage);
      return;
    }
    const checkEmail = RegExp(
      /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i
    );
    if (!checkEmail.test(email)) {
      setError(strings.invalidEmailError);
      return;
    }
    const oldMail = props.user.email;
    props.user.firstName = firstName;
    props.user.lastName = lastName;
    props.user.email = email;
    props.callback(props.user, oldMail);
  };

  /**
   * Closes the form by calling the callback with undefined value
   */
  const handleCancel = () => {
    props.callback(undefined);
  };

  return (
    <View style={commonStyles.formContainer}>
      <Text>{strings.PROFILE.editFormTitle}</Text>
      <Text style={{ color: colors.errorColor }}>{error}</Text>
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
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => handleSubmit()}
        >
          <Text>{strings.confirm}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => handleCancel()}
        >
          <Text>{strings.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProfileEditForm;
