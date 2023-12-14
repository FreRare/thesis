import {
  ScrollView,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import User from "../models/User";
import Layout from "../components/Layout";
import AquariumCard from "../components/AquariumCard";
import Aquarium from "../models/Aquarium";
import AquariumEditForm from "../components/AquariumEditForm";
import strings from "../../config/strings";
import Icon from "react-native-vector-icons/AntDesign";
import colors from "../../config/colors";
import AquariumService from "../services/AquariumService";
import LoadingAnimation from "../components/LoadingAnimation";
import commonStyles from "../utils/commonStyles";
import AuthService from "../services/AuthService";

type AquariumsScreenProps = {
  navigation: any;
  user: User;
  setUser: (u: User | undefined | null) => void;
};

/**
 * The screen for viewing and maintaining aquariums
 * @see {AquariumCard} - to display the aquariums' data
 * @param props The props for the component
 * @returns The screen with a dropdown and the list of AquariumCards
 */
function AquariumsScreen(props: AquariumsScreenProps) {
  const [aquariums, setAquariums] = React.useState<Array<Aquarium>>(
    props.user.aquariums
  );
  const [editing, setEditing] = React.useState<boolean>(false); // Edit flag
  const [edited, setEdited] = React.useState<Aquarium | null>(null); // The edited aquarium
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  /**
   * Callback on refresh
   */
  const refreshCallback = React.useCallback(async () => {
    setLoading(true);
    const loadedAquariums = await AquariumService.getAquariums(
      props.user.email
    );
    const newUser = props.user;
    newUser.aquariums = loadedAquariums;
    props.setUser(newUser);
    setAquariums(newUser.aquariums);
    setLoading(false);
  }, []);

  /**
   * Deletes the aquariums provided also if lastOne is true removes the user
   * @param aq - The aquarium to delete
   * @param lastOne - The flag if it's the last one or no - In case it's the last one we delete the user too
   */
  const deleteAquarium = async (aq: Aquarium, lastOne: boolean) => {
    setEdited(null);
    setEditing(false);
    setLoading(true);
    const deleteResult = await AquariumService.deleteAquarium(aq);
    if (deleteResult.length > 0) {
      setError(deleteResult);
      return;
    }
    if (lastOne) {
      // If last one than delete user and log out
      const userDeleteResult = await AuthService.deleteUser(props.user.email);
      if (userDeleteResult.length > 0) {
        setError(userDeleteResult);
        return;
      }
      props.setUser(null);
    }
    alert("Successfully deleted!");
    setLoading(false);
  };

  /**
   * This function creates or updates an aquarium decided by if the provided aquarium is already on the list or no
   * @param aq - The new or updateable aquarium
   */
  const updateAquarium = async (aq: Aquarium) => {
    setEdited(null);
    setEditing(false);
    setLoading(true);
    const index = aquariums.indexOf(aq);
    if (index < 0) {
      // If we added a new aquarium
      const result = await AquariumService.createAquarium(aq, props.user.email);
      if (result.length > 0) {
        setError(result);
      } else {
        alert("Successfully added " + aq.name + "!");
      }
      aquariums.push(aq);
    } else {
      // Update aquarium
      const result = await AquariumService.updateAquarium(aq);
      if (result.length > 0) {
        setError(result);
      } else {
        alert(strings.successfulUpdate);
      }
    }
    aquariums[index] = aq;
    setLoading(false);
  };

  /**
   * Edit callback for AquariumCard, handles create-update-delete
   * Basically just handles the confirmations and calls the action functions
   * @see {AquariumService} - to handle DB interactions
   * @param aq - the aquarium to be handled
   * @param del - flag if we want to delete
   * @returns - void
   */
  const editHandler = async (aq: Aquarium, del?: boolean) => {
    if (del) {
      // If we're about to delete the last aquarium -> we're about to leave the system, meaning deletion of all aquariums, user and setting the atc-system to factory reset
      Alert.alert(
        strings.confirmation,
        strings.ALERTS.deleteAquariumAlertMessage,
        [
          {
            text: strings.no,
            onPress: () => {
              return;
            },
            style: "cancel",
          },
          {
            text: strings.yes,
            onPress: async () => {
              // If this is the last aquarium do an extra confirm
              if (
                aquariums.length === 1 &&
                aquariums.find((aqu) => aqu.id === aq.id)
              ) {
                Alert.alert(
                  strings.confirm,
                  strings.ALERTS.deleteAndFactoryResetAlertMessage,
                  [
                    {
                      text: strings.no,
                      onPress: () => {
                        return;
                      },
                      style: "cancel",
                    },
                    {
                      text: strings.yes,
                      onPress: () => {
                        deleteAquarium(aq, true);
                      },
                    },
                  ]
                );
              } else {
                deleteAquarium(aq, false);
              }
            },
          },
        ]
      );
    } else {
      updateAquarium(aq);
    }
  };

  /**
   * Filters the aquariums data to the search string and puts the filtered data into the displayable list
   * @param t The search string
   */
  const searchAquarium = (t: string) => {
    const filtered = aquariums.filter((a: Aquarium) => {
      return a.name.toLocaleLowerCase().includes(t.toLocaleLowerCase());
    });
    setAquariums(filtered);
  };

  const addNewOnPress = () => {
    setEdited(null);
    setEditing(true);
  };

  // The cards to display
  const aqauariumCards = props.user.aquariums.map((item, index) => {
    return (
      <AquariumCard
        key={index}
        item={item}
        navigation={props.navigation}
        setEditing={setEditing}
        setEdited={setEdited}
        disabled={editing}
      />
    );
  });

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <View style={styles.searchContainer}>
        <Icon name="search1" size={25} />
        <TextInput
          style={styles.searchInput}
          placeholder={strings.searchByName}
          onChangeText={(t: string) => searchAquarium(t)}
        />
        <TouchableOpacity
          disabled={editing}
          onPress={addNewOnPress}
          style={styles.addContainer}
        >
          <>
            <Text>{strings.addNew}</Text>
            <Icon name="addfolder" size={20} />
          </>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[
          commonStyles.scrollContainer,
          { opacity: editing ? 0.1 : 1 },
        ]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshCallback} />
        }
      >
        {error && <Text>{error}</Text>}
        {aqauariumCards}
      </ScrollView>
      {editing && (
        <AquariumEditForm
          addNewFlag={edited ? false : true}
          aquarium={edited ? edited : new Aquarium()}
          setEditing={setEditing}
          editHandler={editHandler}
        ></AquariumEditForm>
      )}
    </Layout>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  searchContainer: {
    width: "90%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    maxWidth: "70%",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    borderRadius: 20,
    backgroundColor: colors.menuBarBackground,
  },
  addContainer: {
    flex: 0.4,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AquariumsScreen;
