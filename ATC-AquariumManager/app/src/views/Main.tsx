import React from "react";
import Navigation from "../utils/Navigation";
import { NavigationContainer } from "@react-navigation/native";
import useUser from "../utils/hooks/useUser";

function Main() {
  const [user, setUser] = useUser();

  return (
    <>
      <NavigationContainer>
        <Navigation user={user} setUser={setUser} />
      </NavigationContainer>
    </>
  );
}

export default Main;
