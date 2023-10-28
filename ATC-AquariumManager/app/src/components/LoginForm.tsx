import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import strings from "../../config/strings";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/FontAwesome5";
import User from "../models/User";

interface LoginScreenProps {
  navigation: any;
}

function LoginForm(props: LoginScreenProps) {
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [error, setError] = React.useState("");

  const validateLoginFields = () => {
    if (email.length <= 0) {
      setError(strings.missingEmailError);
      return false;
    }
    if (pass.length <= 0) {
      setError(strings.missingPasswordError);
      return false;
    }
    const checkEmail = RegExp(
      /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i
    );
    if (!checkEmail.test(email)) {
      setError(strings.invalidEmailError);
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateLoginFields()) {
      return;
    }
    // All fields are valid, we can post to API
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const loginData = JSON.stringify({
      email: email,
      password: pass,
    });
    fetch(strings.loginApiUrl, {
      method: "POST",
      headers: headers,
      body: loginData,
    })
      .then((response) => {
        if (!response.ok) {
          throw(new Error(strings.unexpectedStatusErrorMessage + response.status))
        }else{
          return response.json();
        }
      })
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          setError(data["error"]);
        } else if (data["user"]) {
          setError(strings.successfulLogin);
          const userData = data["user"];
          const user = new User(
            userData.email,
            userData.firstName,
            userData.lastName
          );
          alert(user.toString());
          props.navigation.navigate(strings.home);  // Redirect to homepage
        }
      })
      .catch((e) => {
        alert("Error: " + e);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Icon name="user-alt" size={40} />
      </View>
      {error && (
        <ScrollView>
          <Text id="errorMsg" style={styles.errorMsg}>
            {error}
          </Text>
        </ScrollView>
      )}
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text>{strings.login}</Text>
      </TouchableOpacity>
      <Text>{strings.or}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => props.navigation.navigate(strings.registration)}
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
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    flexDirection: "column",
    padding: 20,
    marginTop: "10%",
    marginBottom: "10%",
  },
  icon: {
    marginBottom: 20,
    borderColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderRadius: 50,
    padding: 10,
  },
  input: {
    flex: 1,
    width: "90%",
    padding: 10,
    margin: "5%",
    backgroundColor: colors.menuBarBackground,
    maxHeight: 50,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  focusedInput: {
    flex: 1,
    width: "95%",
    padding: 10,
    margin: "5%",
    backgroundColor: colors.menuBarBackground,
    maxHeight: 50,
    borderRadius: 10,
  },
  button: {
    borderColor: colors.primary,
    borderWidth: 4,
    borderRadius: 50,
    backgroundColor: colors.menuBarBackground,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    padding: "5%",
    margin: "5%",
  },
  errorMsg: {
    color: colors.errorColor,
    flex: 1.5,
    fontSize: 15,
  },
});

export default LoginForm;
