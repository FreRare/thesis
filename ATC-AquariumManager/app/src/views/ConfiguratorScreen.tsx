import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { SelectList } from "react-native-dropdown-select-list";
import strings from "../../config/strings";
import { ScrollView, StyleSheet, Dimensions, View, Text } from "react-native";
import ConfiguratorDataDisplayer from "../components/ConfiguratorDataDisplayer";
import Aquarium from "../models/Aquarium";
import commonStyles from "../utils/commonStyles";
import AquariumConfiguration from "../models/AquariumConfiguration";
import AquariumConfigEditForm from "../components/AquariumConfigEditForm";
import AquariumService from "../services/AquariumService";
import User from "../models/User";
import LoadingAnimation from "../components/LoadingAnimation";

type ConfiguratorScreenProps = {
  navigation: any;
  user: User;
};

/**
 * This is the screen for configurations
 * Lists all configs and have a dropdown to choose which aquarium you want to see.
 * @see {ConfiguratorDataDisplayer} - uses it to display the data
 * @param props The props for the component
 * @returns The whole screen
 */
function ConfiguratorScreen(props: ConfiguratorScreenProps) {
  const [aquariums, setAquariums] = React.useState<Array<Aquarium>>(
    props.user.aquariums
  ); // All aquariums the user have
  // The actual aquarium which's data is displayed
  const [selectedAquarium, setSelectedAquarium] = React.useState<Aquarium>(
    aquariums[0]
  );
  // The flag for editing
  const [edit, setEdit] = React.useState<boolean>(false);
  const [editLabel, setEditLabel] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  /**
   * Makes sure that the data is loaded only once and that the dropdown list data is filled up.
   */
  useEffect(() => {
    if (aquariumSelectList.length <= 0) {
      for (const aq of aquariums) {
        aquariumSelectList.push({ key: aq.id, value: aq.name });
      }
    }
  });

  const aquariumSelectList: Array<{ key: number; value: string }> = []; // Data for the dropdown list

  /**
   * Sets the selected useState to the aquarium identified by val
   * @param {number} val the ID of the selected aquarium
   */
  const handleSelect = (val: number) => {
    const foundAQ = aquariums.find((aq) => aq.id === val) as Aquarium;
    setSelectedAquarium(foundAQ);
  };

  /**
   * The callback for AquariumConfigEditForm component
   * Updates data in DB and handles error messaging
   * @param config - the edited config in the form
   */
  const handleEditSubmit = async (config: AquariumConfiguration) => {
    selectedAquarium.config = config;
    const updateResult = await AquariumService.updateConfiguration(
      selectedAquarium
    );
    if (updateResult.length > 0) {
      setError(updateResult);
    } else {
      alert(strings.successfulUpdate);
      setError("");
    }
    setSelectedAquarium(selectedAquarium);
    setEdit(false);
  };

  /**
   * The callback for AquariumConfigEditForm component
   * Flips edit flag to display the edit form
   * @param label - the label of the config edited so AquariumConfigEditForm can decide which form to display
   */
  const editCallback = (label: string) => {
    setEditLabel(label);
    setEdit(true);
  };

  return (
    <Layout
      navigation={props.navigation}
      shouldDisplayMenuBar={edit ? false : true}
    >
      {loading && <LoadingAnimation />}
      <ScrollView
        contentContainerStyle={[styles.container, { opacity: edit ? 0.1 : 1 }]}
      >
        <View style={commonStyles.horizontal}>
          <SelectList
            search={false}
            inputStyles={commonStyles.dropdownListInputStyle}
            boxStyles={commonStyles.dropdownListBoxStyle}
            dropdownStyles={commonStyles.dropdownListDropdownStyles}
            placeholder={strings.aquariumSelctorPlaceholder}
            setSelected={(val: number) => handleSelect(val)}
            data={aquariumSelectList}
            defaultOption={
              aquariums.length > 0
                ? {
                    key: aquariums[0].id,
                    value: aquariums[0].name,
                  }
                : undefined
            }
          />
        </View>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        {selectedAquarium instanceof Aquarium && (
          <ConfiguratorDataDisplayer
            editDisabled={edit}
            aquariumConfigData={selectedAquarium.config}
            editCallback={editCallback}
          />
        )}
      </ScrollView>
      {edit && (
        <AquariumConfigEditForm
          aquariumName={selectedAquarium.name}
          editableConfig={selectedAquarium.config}
          label={editLabel}
          cancelCallBack={setEdit}
          submitCallback={handleEditSubmit}
        />
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

export default ConfiguratorScreen;
