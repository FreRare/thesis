import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import strings from "../../config/strings";
import colors from "../../config/colors";
import * as Notifications from "expo-notifications";
import User from "../models/User";
import AuthService from "../services/AuthService";
import LoadingAnimation from "./LoadingAnimation";
import commonStyles from "../utils/commonStyles";

interface RegistrationFormProps {
  navigation: any;
  setUser: (u: User | undefined | null, rememberMe?: boolean) => void;
  setIsLogin: (l: boolean) => void;
}

function RegistrationForm(props: RegistrationFormProps) {
  const [error, setError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordAgain, setPasswordAgain] = React.useState("");
  const [aqId, setAqId] = React.useState(""); // need to convert to number
  const [isRememberMe, setIsRememberMe] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  // this function handles the app for push notifications
  // registeres the app and gets the token for the device what we can store in db later
  const registerForPushNotifications = async (): Promise<false | string> => {
    const { granted } = await Notifications.getPermissionsAsync();
    if (!granted) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied for push notifications!");
        return false;
      }
    }
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: strings.expoProjectId,
      })
    ).data;
    return token;
    // Token stores the device registration token it can be sent to server
  };

  /**
   * Validates all the fields in the form.
   * Sets the error message if an error occured.
   * @returns False if there's a problem, parsed aquarium ID otherwise (still should be checked if present in DB on server side)
   */
  const validateSignupInputs = (): false | number => {
    if (email.length <= 0) {
      setError(strings.missingEmailError);
      return false;
    }
    const checkEmail = RegExp(
      /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i
    );
    if (!checkEmail.test(email)) {
      setError(strings.invalidEmailError);
      return false;
    }
    if (firstName.length <= 0) {
      setError(strings.missingFirstNameError);
      return false;
    }
    if (lastName.length <= 0) {
      setError(strings.missingLastNameError);
      return false;
    }
    if (password.length < 8) {
      setError(strings.shortPasswordError);
      return false;
    }
    if (password !== passwordAgain) {
      setError(strings.passwordsNotMatchError);
      return false;
    }
    if (aqId.length <= 0) {
      setError(strings.missingAquariumIdError);
      return false;
    }
    const aqIdNumber = Number.parseInt(aqId, 10);
    if (isNaN(aqIdNumber)) {
      setError(strings.invalidAquariumIdError);
      return false;
    }
    setError("");
    return aqIdNumber;
  };

  const handleSignup = async () => {
    setLoading(true);
    const aquariumID = validateSignupInputs();
    if (aquariumID === false) {
      setLoading(false);
      return;
    }
    // Wait until we get the notifications permission and the device's token
    let token = await registerForPushNotifications();
    if (token === false) {
      // Just to make sure
      alert(strings.pushNotificationsDeniedAlertMessage);
      token = strings.noDeviceTokenString; // if notifications aren't allowed
    } else {
      // alert("Device token: " + token);
    }
    // We can perform registartion
    const authResult = await AuthService.signUpUser(
      email,
      firstName,
      lastName,
      password,
      aquariumID,
      token
    );
    // alert("Auth result:" + authResult);
    // If we have a registarted user
    if (authResult instanceof User) {
      props.setUser(authResult, isRememberMe);
      // alert("User logged in!");
      props.navigation.navigate(strings.home);
    } else {
      setError(authResult);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingAnimation />}
      <View style={styles.icon}>
        <Icon name="user-plus" size={30} />
      </View>
      {error && (
        <ScrollView contentContainerStyle={styles.errorContainer}>
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
        autoComplete="email"
      />
      <TextInput
        placeholder={strings.firstNameInputPlaceholder}
        style={commonStyles.input}
        value={firstName}
        onChangeText={(e) => setFirstName(e)}
        autoCapitalize="words"
        autoComplete="given-name"
      />
      <TextInput
        placeholder={strings.lastNameInputPlaceholder}
        style={commonStyles.input}
        value={lastName}
        onChangeText={(e) => setLastName(e)}
        autoCapitalize="words"
        autoComplete="family-name"
      />
      <TextInput
        placeholder={strings.passInputPlaceHolder}
        style={commonStyles.input}
        value={password}
        onChangeText={(t) => setPassword(t)}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TextInput
        placeholder={strings.passAgainInputPlaceholder}
        style={commonStyles.input}
        value={passwordAgain}
        onChangeText={(t) => setPasswordAgain(t)}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TextInput
        placeholder={strings.aquariumIdInputPlaceholder}
        style={commonStyles.input}
        value={aqId}
        inputMode="numeric"
        maxLength={10}
        keyboardType="numeric"
        onChangeText={(t) => setAqId(t)}
      />
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text>{strings.confirm}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.setIsLogin(true)}
        >
          <Text>{strings.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
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
    marginTop: "3%",
    marginBottom: "3%",
  },
  buttonContainer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "75%",
  },
  icon: {
    marginBottom: 10,
    borderColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderRadius: 50,
    padding: 15,
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
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorMsg: {
    color: colors.errorColor,
    fontSize: 15,
    textAlign: "center",
  },
});

export default RegistrationForm;
