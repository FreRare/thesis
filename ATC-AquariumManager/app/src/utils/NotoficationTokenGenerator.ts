import * as Notifications from "expo-notifications";
import strings from "../../config/strings";

// this function handles the app for push notifications
  // registeres the app and gets the token for the device what we can store in db later
export const registerForPushNotifications = async (): Promise<false | string> => {
    const { granted } = await Notifications.getPermissionsAsync();
    if (!granted) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
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
    // TODO! should be updated per installation IDK how yet
  };