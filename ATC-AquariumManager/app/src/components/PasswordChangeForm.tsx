import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import commonStyles from "../utils/commonStyles";
import strings from "../../config/strings";
import colors from "../../config/colors";

type ChangePasswordFormProps = {
  callback: (oldPass: string | undefined, newPass?: string) => void;
};

function PasswordChangeForm(props: ChangePasswordFormProps) {
  const [oldPass, setOldPass] = React.useState<string>("");
  const [newPass, setNewPass] = React.useState<string>("");
  const [newPassAgain, setNewPassAgain] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const validateAndChange = () => {
    if (newPass.length < 8) {
      setError(strings.shortPasswordError);
      return;
    }
    if (newPass !== newPassAgain) {
      setError(strings.passwordsNotMatchError);
      return;
    }
    if (newPass === oldPass) {
      setError(strings.PROFILE.newPassCannotBeOldMessage);
      return;
    }
    props.callback(oldPass, newPass);
  };

  return (
    <View style={commonStyles.formContainer}>
      <Text style={styles.title}>{strings.PROFILE.changePasswordTitle}</Text>
      <Text style={{ color: colors.errorColor }}>{error}</Text>
      <View style={commonStyles.vertical}>
        <Text>{strings.oldPassword}</Text>
        <TextInput
          style={commonStyles.input}
          onChangeText={(t: string) => setOldPass(t)}
          autoCapitalize="none"
          secureTextEntry={true}
        />
      </View>
      <View style={commonStyles.vertical}>
        <Text>{strings.newPassword}</Text>
        <TextInput
          style={commonStyles.input}
          onChangeText={(t: string) => setNewPass(t)}
          autoCapitalize="none"
          secureTextEntry={true}
        />
      </View>
      <View style={commonStyles.vertical}>
        <Text>{strings.newPasswordAgain}</Text>
        <TextInput
          style={commonStyles.input}
          onChangeText={(t: string) => setNewPassAgain(t)}
          autoCapitalize="none"
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity
        style={commonStyles.button}
        onPressOut={validateAndChange}
      >
        <Text>{strings.confirm}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={commonStyles.button}
        onPressOut={() => props.callback(undefined)}
      >
        <Text>{strings.cancel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    marginTop: 10,
    marginBottom: 30,
    fontSize: 20,
  },
});

export default PasswordChangeForm;
