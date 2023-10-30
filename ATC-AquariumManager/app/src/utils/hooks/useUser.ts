import React from "react";
import User from "../../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "../../services/AuthService";

/**
 * React.useState based user handling system
 * For initialization either a User or undefined,
 * also setUser can take null for logout only //!(this case removes the token from device storage)
 * It tries to load the user token from the memory and get the user for it on init
 * So check if user is undefined or user
 * @param u the user we want to set or undefined
 * @returns A React.useState likely user handling system
 */
const useUser = (): [
  user: User | undefined,
  (user: User | undefined | null) => void
] => {
  // The original useState
  const [user, _setUser] = React.useState<User | undefined>();

  // usable setUser
  const setUser = async (user: User | undefined | null): Promise<void> => {
    try {
      // If we got a user set save the token to the device
      if (user instanceof User) {
        await AsyncStorage.setItem("user_token", user.getToken());
      } else if (user === null) {
        // If we have null means we want to delete token
        await AsyncStorage.removeItem("user_token");
        setUser(undefined);
      }
      // If we have undefined just set user to undefined
      _setUser(undefined);
    } catch (e) {
      alert("Error while saving user data: " + e);
    }
  };

  // just for init
  const getUser = async () => {
    try {
      const userToken = await AsyncStorage.getItem("user_token"); // load user
      if (userToken !== null) {
        // if we have saved token login
        const authResult = await AuthService.tryLoginWithToken(userToken);
        if (typeof authResult === "string") {
          // If we have an error
          alert(
            ("Error while logging in with saved token: " + authResult) as string
          );
          _setUser(undefined);
        } else {
          // Otherwise set the user
          _setUser(authResult as User);
        }
      }
    } catch (e) {
      alert("Error while loading user data: " + e);
      return undefined;
    }
  };
  // Call function
  getUser();

  return [user, setUser];
};

export default useUser;
