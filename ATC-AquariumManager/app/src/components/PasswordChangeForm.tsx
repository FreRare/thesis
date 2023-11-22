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

type ChangePasswordFormProps = {
  callback: (val: string | undefined) => void;
};

function PasswordChangeForm(props: ChangePasswordFormProps) {
  const [oldPass, setOldPass] = React.useState<string>("");
  const [oldPassAgain, setOldPassAgain] = React.useState<string>("");
  const [newPass, setNewPass] = React.useState<string>("");

  return (
    <View style={commonStyles.formContainer}>
      <Text style={styles.title}>Change password</Text>
      <View style={commonStyles.vertical}>
        <Text>{strings.oldPassword}</Text>
        <TextInput style={commonStyles.input} />
      </View>
      <View style={commonStyles.vertical}>
        <Text>{strings.oldPasswordAgain}</Text>
        <TextInput style={commonStyles.input} />
      </View>
      <View style={commonStyles.vertical}>
        <Text>{strings.newPassword}</Text>
        <TextInput style={commonStyles.input} />
      </View>
      <TouchableOpacity
        style={commonStyles.button}
        onPressOut={() => props.callback(newPass)}
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
