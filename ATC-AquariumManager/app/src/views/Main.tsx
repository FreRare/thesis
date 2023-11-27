import React from "react";
import Navigation from "../utils/Navigation";
import { NavigationContainer } from "@react-navigation/native";
import useUser from "../utils/hooks/useUser";
import useAquariums from "../utils/hooks/useAquariums";
import AquariumService from "../services/AquariumService";
import { Text, View } from "react-native";
import User from "../models/User";
import Aquarium from "../models/Aquarium";

/**
 * Loads the aquariums from the DB, sets the useState for the array fetched
 */
const loadAquariums = async (
  user: User,
  loadingCallback: (val: boolean) => void
): Promise<Array<Aquarium>> => {
  const loadedAquariums = await AquariumService.getAquariums(
    user.email as string
  );
  if (typeof loadedAquariums === "string") {
    alert(loadedAquariums as string);
    loadingCallback(false);
    return [];
  } else {
    loadingCallback(false);
    return loadedAquariums;
  }
};

function Main() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [user, setUser, getUser] = useUser();

  React.useEffect(() => {
    const loadEverything = async () => {
      getUser().then(() => {
        if (user) {
          const loadedUser = user;
          loadAquariums(user as User, setLoading).then((aq) => {
            loadedUser.aquariums = aq;
          });
          setUser(loadedUser);
        }
      });
    };

    if (loading) {
      loadEverything();
    }
  });

  return (
    <>
      {loading && (
        <View>
          <Text>LOADING...</Text>
        </View>
      )}
      <NavigationContainer>
        <Navigation user={user} setUser={setUser} />
      </NavigationContainer>
    </>
  );
}

export default Main;
