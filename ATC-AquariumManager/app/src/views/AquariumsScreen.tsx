import { View, ScrollView, Text, Dimensions, StyleSheet } from "react-native";
import React from "react";
import Layout from "../components/Layout";
import colors from "../../config/colors";
import strings from "../../config/strings";
import AquariumCard from "../components/AquariumCard";
import Aquarium from "../models/Aquarium";
import EditAquariumForm from "../components/EditAquariumForm";
import { SelectList } from "react-native-dropdown-select-list";
import AquariumSortingMethods from "../utils/AquariumSortingMethods";

type AquariumsScreenProps = {
  navigation: any;
};

function AquariumsScreen(props: AquariumsScreenProps) {
  const { AquariumSortingMethodsSelectList, AquariumSortingMethodsList } =
    AquariumSortingMethods;

  const [editing, setEditing] = React.useState<boolean>(false); // Edit flag
  const [edited, setEdited] = React.useState<Aquarium | null>(null); // The edited aquarium
  const [sortingMethod, setSortingMethod] = React.useState<string>(
    AquariumSortingMethodsSelectList[0].value
  );

  // TODO load aquariums form db
  const loadedAquariums = [
    new Aquarium(1),
    new Aquarium(2),
    new Aquarium(3),
    new Aquarium(4),
  ];
  // Deciding the sorting method
  loadedAquariums.sort(
    AquariumSortingMethodsList.find((val) => val.key === sortingMethod)?.value
  );
  const [aquariums, setAquariums] =
    React.useState<Array<Aquarium>>(loadedAquariums); // To store the aquaiums list

  const sortMethodChangeHandler = () => {
    const sorted = aquariums.sort(
      AquariumSortingMethodsList.find((val) => val.key === sortingMethod)?.value
    );
    setAquariums(sorted);
  };

  // Callback for the editor form
  const editHandler = (aq: Aquarium) => {
    setEdited(null);
    setEditing(false);
    const filtered = [];
    for (let i = 0; i < aquariums.length; i++) {
      if (aquariums[i].id !== aq.id) {
        filtered.push(aquariums[i]);
      }
    }
    filtered.push(aq);
    filtered.sort(
      AquariumSortingMethodsList.find((val) => val.key === sortingMethod)?.value
    );
    setAquariums(filtered);
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
        <SelectList
          boxStyles={{
            backgroundColor: colors.menuBarBackground,
            width: 300,
          }}
          inputStyles={{ color: colors.black }}
          dropdownStyles={{
            backgroundColor: colors.menuBarBackground,
            opacity: 1,
            zIndex: 9,
          }}
          placeholder={strings.sortSelectorPlaceholder}
          setSelected={(val: string) => setSortingMethod(val)}
          onSelect={() => sortMethodChangeHandler()}
          data={AquariumSortingMethodsSelectList}
          save="value"
        />
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
});

export default AquariumsScreen;
