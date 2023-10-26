import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import strings from "../../config/strings";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";

function LoginForm(navigation: any) {
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");

  return (
    <View style={styles.container}>
      <Icon name="user" size={50} style={styles.icon} />
      <TextInput
        id="email"
        placeholder={strings.emailInputPlaceholder}
        style={styles.input}
        value={email}
        onChangeText={(e) => setEmail(e)}
      ></TextInput>
      <TextInput
        id="password"
        placeholder={strings.passInputPlaceHolder}
        style={styles.input}
        value={pass}
        onChangeText={(t) => setPass(t)}
        secureTextEntry={true}
      ></TextInput>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(strings.login)}
      >
        <Text>{strings.login}</Text>
      </TouchableOpacity>
      <Text>{strings.or}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(strings.regitration)}
      >
        <Text>{strings.signup}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    opacity: 0.8,
    width: "75%",
    backgroundColor: colors.background,
    borderColor: colors.textSecondary,
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    flexDirection: "column",
    paddingTop: 30,
    marginTop: "10%",
    marginBottom: "10%",
  },
  icon: {
    marginBottom: 10,
  },
  input: {
    flex: 1,
    width: "80%",
    padding: 10,
    margin: "5%",
    backgroundColor: colors.menuBarBackground,
    maxHeight: 50,
  },
  button: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    padding: "8%",
    margin: "10%",
  },
});

export default LoginForm;
