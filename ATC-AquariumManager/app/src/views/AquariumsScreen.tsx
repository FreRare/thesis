import {
  ScrollView,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  TouchableHighlight,
} from "react-native";
import React from "react";
import Layout from "../components/Layout";
import AquariumCard from "../components/AquariumCard";
import Aquarium from "../models/Aquarium";
import EditAquariumForm from "../components/EditAquariumForm";
import commonStyles from "../utils/commonStyles";
import strings from "../../config/strings";
import Icon from "react-native-vector-icons/AntDesign";

type AquariumsScreenProps = {
  navigation: any;
};

function AquariumsScreen(props: AquariumsScreenProps) {
  // TODO load aquariums form db
  const loadedAquariums = [
    new Aquarium(1),
    new Aquarium(2),
    new Aquarium(3),
    new Aquarium(4),
  ];

  const [editing, setEditing] = React.useState<boolean>(false); // Edit flag
  const [edited, setEdited] = React.useState<Aquarium | null>(null); // The edited aquarium
  const [aquariums, setAquariums] =
    React.useState<Array<Aquarium>>(loadedAquariums); // To store all data on locale until screen is on
  const [aquariumsList, setAquariumsList] =
    React.useState<Array<Aquarium>>(loadedAquariums); // To display the data locale

  // Callback for the editor form
  const editHandler = (aq: Aquarium) => {
    setEdited(null);
    setEditing(false);
    // TODO post saves to DB
    const index = aquariums.indexOf(aq);
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
    setAquariumsList(filtered);
  };

  // The cards to display
  const aqauariumCards = aquariumsList.map((item, index) => {
    return (
      <AquariumCard
        key={index}
        item={item}
        navigation={props.navigation}
        setEditing={setEditing}
        setEdited={setEdited}
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
            style={commonStyles.input}
            placeholder={strings.searchByName}
            onChangeText={(t: string) => searchAquarium(t)}
          />
        </View>
        {aqauariumCards}
      </ScrollView>
      {editing && edited && (
        <EditAquariumForm
          aquarium={edited}
          setEditing={setEditing}
          editHandler={editHandler}
        ></EditAquariumForm>
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
    width: "80%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AquariumsScreen;
