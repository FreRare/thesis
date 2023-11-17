import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import strings from "../../config/strings";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/FontAwesome5";
import User from "../models/User";
import AuthService from "../services/AuthService";
import LoadingAnimation from "./LoadingAnimation";
import commonStyles from "../utils/commonStyles";

interface LoginScreenProps {
  navigation: any;
  setIsLogin: (l: boolean) => void;
  setUser: (u: User | undefined | null, rememberMe?: boolean) => void;
}

function LoginForm(props: LoginScreenProps) {
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [isRememberMe, setIsRememberMe] = React.useState<boolean>(true);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);

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
    setLoading(true);
    if (!validateLoginFields()) {
      setLoading(false);
      return;
    }
    const loginData = await AuthService.tryLogin(email, pass);
    if (loginData instanceof User) {
      props.setUser(loginData, isRememberMe); // Save user
    } else {
      setError(loginData);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingAnimation />}
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
        placeholder={strings.emailInputPlaceholder}
        style={commonStyles.input}
        value={email}
        onChangeText={(e) => setEmail(e)}
        autoCapitalize="none"
      ></TextInput>
      <TextInput
        placeholder={strings.passInputPlaceHolder}
        style={commonStyles.input}
        value={pass}
        onChangeText={(t) => setPass(t)}
        secureTextEntry={true}
        autoCapitalize="none"
      ></TextInput>
      <BouncyCheckbox
        size={25}
        style={{ flex: 1 }}
        fillColor={colors.checkBoxColor}
        innerIconStyle={{ borderWidth: 2 }}
        text={strings.rememberMe}
        textStyle={{ color: colors.checkBoxColor, textDecorationLine: "none" }}
        isChecked={isRememberMe}
        onPress={() => {
          setIsRememberMe(!isRememberMe);
        }}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text>{strings.login}</Text>
      </TouchableOpacity>
      <Text>{strings.or}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => props.setIsLogin(false)}
      >
        <Text>{strings.signup}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: 50,
    opacity: 1,
    width: "75%",
    backgroundColor: colors.formBackround,
    borderColor: colors.textSecondary,
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    flexDirection: "column",
    marginTop: "10%",
    marginBottom: "10%",
  },
  icon: {
    marginBottom: 20,
    marginTop: 20,
    borderColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderRadius: 50,
    padding: 10,
  },
  button: {
    borderColor: colors.primary,
    borderWidth: 4,
    borderRadius: 50,
    backgroundColor: colors.secondary,
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
