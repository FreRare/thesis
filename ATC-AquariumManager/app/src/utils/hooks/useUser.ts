import React, { useEffect } from "react";
import User from "../../models/User";
import * as SecureStorage from "expo-secure-store";
import AuthService from "../../services/AuthService";
import { PermissionsAndroid, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AquariumService from "../../services/AquariumService";

/**
 * Function to request storage permissions
 */
const requestStoragePermissionsForAndroid = async (): Promise<boolean> => {
  if (Platform.OS !== "android") {
    // Permissions are only for android
    return false;
  }
  // Check if we have permissions
  if (
    (await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    )) &&
    (await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    ))
  ) {
    return true;
  }
  // If not request them
  try {
    const grantedWrite = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "ATC Aquarium Manager storage permission",
        message:
          "ATC Aquarium Manager needs your permission to write data to the device's storage so it can save your preferences.",
        buttonNegative: "Deny",
        buttonPositive: "Accept",
      }
    );
    const grantedRead = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "ATC Aquarium Manager storage permission",
        message:
          "ATC Aquarium Manager needs your permission to read data from the device's storage so it can access the saved preferences of yours.",
        buttonNegative: "Deny",
        buttonPositive: "Accept",
      }
    );
    if (
      grantedRead === PermissionsAndroid.RESULTS.GRANTED &&
      grantedWrite === PermissionsAndroid.RESULTS.GRANTED
    ) {
      return true;
    } else {
      alert("Permissions denied, you won't be able to save your login data!");
      return false;
    }
  } catch (e) {
    alert("ERROR while getting permission: " + e);
    return false;
  }
};

/**
 * React.useState based user handling system
 * For initialization either a User or undefined,
 * also setUser can take null for logout only //!(this case removes the token from device storage)
 * It tries to load the user token from the memory and get the user for it on init
 * Also it can be set to retrieve session data in any component
 * So check if user is undefined or user
 * @param u the user we want to set or undefined
 * @returns A React.useState likely user handling system
 */
const useUser = (): [
  user: User | undefined,
  (user: User | undefined | null, rememberMe?: boolean) => void,
  boolean
] => {
  // The original useState
  const [_user, _setUser] = React.useState<User | undefined>();
  const [loaded, setLoaded] = React.useState<boolean>(false);

  useEffect(() => {
    if (!loaded) {
      getUser();
      setLoaded(true);
    }
  });

  // usable setUser
  const setUser = async (
    user: User | undefined | null,
    rememberMe: boolean = false
  ): Promise<void> => {
    // Login detection (On login we want to trigger a load of data)
    if ((_user === undefined || _user === null) && user instanceof User) {
      // If login with token is successful try load aquariums
      const aquariumsResult = await AquariumService.getAquariums(user.email);
      if (typeof aquariumsResult === "string") {
        alert("Error while getting aquariums");
      } else {
        user.aquariums = aquariumsResult;
      }
    }

    const storagePermissionAllowed =
      await requestStoragePermissionsForAndroid();
    if (user === null) {
      // If we have null means we want to delete token
      if (storagePermissionAllowed) {
        await SecureStorage.deleteItemAsync("user_token");
      }
      _setUser(undefined);
      return;
    }

    try {
      // If we got a user set save the token to the device
      if (user instanceof User) {
        if (storagePermissionAllowed) {
          if (rememberMe) {
            // Store user token
            await SecureStorage.setItemAsync("user_token", user.authToken);
          }
        }
        // Set the valid user
        _setUser(user);
        return;
      }
      _setUser(undefined);
    } catch (e) {
      alert("Error while saving user data: " + e);
    }
  };

  // just for init
  const getUser = async () => {
    if (_user) {
      return;
    }
    const storagePermissionAllowed =
      await requestStoragePermissionsForAndroid();
    if (storagePermissionAllowed) {
      try {
        // Try token login
        const userToken = await SecureStorage.getItemAsync("user_token");
        if (userToken !== null) {
          // if we have saved token login
          const authResult = await AuthService.tryLoginWithToken(userToken);
          if (typeof authResult === "string") {
            // If we have an error
            alert(
              ("Error while logging in with saved token: " +
                authResult) as string
            );
            _setUser(undefined);
          } else {
            // If login with token is successful try load aquariums
            const aquariumsResult = await AquariumService.getAquariums(
              authResult.email
            );
            if (typeof aquariumsResult === "string") {
              alert("Error while getting aquariums");
            } else {
              authResult.aquariums = aquariumsResult;
            }
            // Otherwise set the user
            _setUser(authResult as User);
          }
        } else {
          // If we have no token -> user wasn't remembered -> user is undefined
          _setUser(undefined);
        }
      } catch (e) {
        alert("Error while getting data from storage!" + e);
      }
    } else {
      _setUser(undefined);
    }
  };
  return [_user, setUser, loaded];
};

export default useUser;
