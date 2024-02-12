import React, { useRef, useState} from "react";
import { Alert } from "react-native";
import Navigation from "../utils/Navigation";
import { NavigationContainer } from "@react-navigation/native";
import useUser from "../utils/hooks/useUser";
import * as Notification from 'expo-notifications';

Notification.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function Main() {
  const [user, setUser] = useUser();
  const notificationListener = useRef<Notification.Subscription>();
  const responseListener = useRef<Notification.Subscription>();

  React.useEffect(() => {
    notificationListener.current = Notification.addNotificationReceivedListener(handleNotifications);
  
    responseListener.current = Notification.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    return () => {
      Notification.removeNotificationSubscription(notificationListener.current as Notification.Subscription);
      Notification.removeNotificationSubscription(responseListener.current as Notification.Subscription);
    };
  }, []);

  const handleNotifications = (notification: Notification.Notification) => {
    Alert.alert(
      'Notification Received',
      notification.request.content.body as string,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
  };
  

  return (
    <>
      <NavigationContainer>
        <Navigation user={user} setUser={setUser} />
      </NavigationContainer>
    </>
  );
}

export default Main;
