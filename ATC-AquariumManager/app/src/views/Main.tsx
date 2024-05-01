import React, { useRef, useState } from "react";
import { Alert } from "react-native";
import Navigation from "../utils/Navigation";
import { NavigationContainer } from "@react-navigation/native";
import useUser from "../utils/hooks/useUser";
import * as Notification from "expo-notifications";

Notification.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function Main() {
  const [user, setUser, isUserLoaded] = useUser(); // Hopefully this loaded flag can help on startup
  const notificationListener = useRef<Notification.Subscription>();
  const responseListener = useRef<Notification.Subscription>();

  /**
   * Notification handling
   */
  React.useEffect(() => {
    notificationListener.current =
      Notification.addNotificationReceivedListener(handleNotifications);

    responseListener.current =
      Notification.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      Notification.removeNotificationSubscription(
        notificationListener.current as Notification.Subscription
      );
      Notification.removeNotificationSubscription(
        responseListener.current as Notification.Subscription
      );
    };
  }, []);

  /**
   * This function is used to create an alert for the user when the app is in use and we receive a notification
   * @param notification - The notification received
   */
  const handleNotifications = (notification: Notification.Notification) => {
    Alert.alert(
      "Notification Received",
      notification.request.content.body as string,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  return (
    <>
      <NavigationContainer>
        <Navigation user={user} setUser={setUser} isUserLoaded={isUserLoaded} />
      </NavigationContainer>
    </>
  );
}

export default Main;
