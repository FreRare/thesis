import React from "react";
import Aquarium from "../../models/Aquarium";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AquariumService from "../../services/AquariumService";
import User from "../../models/User";
import { PermissionsAndroid, Platform } from "react-native";

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
 * React useState based aquarium storage with memory access and session like storing
 * On init tries to load data from memory - if not possible tries to load it from API
 * ! On API directed updates set should be called to update the storage too
 * Stores the data between sessions, so user can access the data while offline
 * @param user - the user to know whose aquariums to load
 * @returns - the aquariums array and a function to set it
 */
const useAquariums = (): [
  aquarium: Array<Aquarium>,
  (aqs: Array<Aquarium> | null) => void
] => {
  const [aquariums, _setAquariums] = React.useState<Array<Aquarium>>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!loaded) {
      getAquariums();
      setLoaded(true);
    }
  });

  const setAquariums = async (aqs: Array<Aquarium> | null) => {
    try {
      if (await requestStoragePermissionsForAndroid()) {
        // Delete storage
        if (aqs === null) {
          await AsyncStorage.removeItem("aquariums");
          setAquariums([]);
          return;
        }
        await AsyncStorage.setItem("aquariums", JSON.stringify(aqs));
      }
      _setAquariums([]);
    } catch (e) {
      alert("Error while setting aquariums! " + e);
    }
  };

  /**
   * On init get's called by useEffect
   * Tries to load aquariums form storage
   */
  const getAquariums = async (): Promise<void> => {
    try {
      if (await requestStoragePermissionsForAndroid()) {
        const loadedAquariums = await AsyncStorage.getItem("aquariums"); // try load data
        if (loadedAquariums === null) {
          _setAquariums([]);
        } else {
          _setAquariums(JSON.parse(loadedAquariums));
          return;
        }
      }
      _setAquariums([]);
    } catch (e) {
      console.error("Error while loading aquariums!");
    }
  };

  return [aquariums, setAquariums];
};

export default useAquariums;
