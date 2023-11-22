import {
  ScrollView,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Layout from "../components/Layout";
import AquariumCard from "../components/AquariumCard";
import Aquarium from "../models/Aquarium";
import AquariumEditForm from "../components/AquariumEditForm";
import commonStyles from "../utils/commonStyles";
import strings from "../../config/strings";
import Icon from "react-native-vector-icons/AntDesign";
import colors from "../../config/colors";

type AquariumsScreenProps = {
  navigation: any;
};

function AquariumsScreen(props: AquariumsScreenProps) {
  // TODO load aquariums form db
  const loadedAquariums = [new Aquarium(1), new Aquarium(2)];

  const [editing, setEditing] = React.useState<boolean>(false); // Edit flag
  const [edited, setEdited] = React.useState<Aquarium | null>(null); // The edited aquarium
  const [aquariums, setAquariums] =
    React.useState<Array<Aquarium>>(loadedAquariums); // To store aquariums

  // Callback for the editor form
  const editHandler = (aq: Aquarium, deleteFlag: boolean) => {
    setEdited(null);
    setEditing(false);
    if (deleteFlag) {
      // TODO delete from db
      const newAquariums = aquariums.filter((a: Aquarium) => {
        return a.id !== aq.id;
      });
      setAquariums(newAquariums);
      return;
    }
    // TODO post saves to DB
    const index = aquariums.indexOf(aq);
    // If we added a new aquarium
    if (index < 0) {
      // TODO
      console.log("Add aqaurium to DB");
      aquariums.push(aq);
    }
    aquariums[index] = aq;
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
  const aqauariumCards = aquariums.map((item, index) => {
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
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { opacity: editing ? 0.1 : 1 },
        ]}
      >
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
  container: {
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  searchContainer: {
    width: "90%",
    flex: 1,
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
