import React from "react";
import Layout from "../components/Layout";
import strings from "../../config/strings";
import { ScrollView, Text } from "react-native";
import ConfiguratorDataDisplayer from "../components/ConfiguratorDataDisplayer";
import Aquarium from "../models/Aquarium";
import commonStyles from "../utils/commonStyles";
import AquariumConfiguration from "../models/AquariumConfiguration";
import AquariumConfigEditForm from "../components/AquariumConfigEditForm";
import AquariumService from "../services/AquariumService";
import User from "../models/User";
import LoadingAnimation from "../components/LoadingAnimation";
import AquariumSelectList from "../components/AquariumSelectList";
import { RefreshControl } from "react-native";

type ConfiguratorScreenProps = {
  navigation: any;
  user: User;
  setUser: (u: User | undefined | null) => void;
};

/**
 * This is the screen for configurations
 * Lists all configs and have a dropdown to choose which aquarium you want to see.
 * @see {ConfiguratorDataDisplayer} - uses it to display the data
 * @param props The props for the component
 * @returns The whole screen
 */
function ConfiguratorScreen(props: ConfiguratorScreenProps) {
  // The actual aquarium which's data is displayed
  const [selectedAquarium, setSelectedAquarium] = React.useState<Aquarium>(
    props.user.aquariums[0]
  );
  // The flag for editing
  const [edit, setEdit] = React.useState<boolean>(false);
  const [editLabel, setEditLabel] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  /**
   * The callback for AquariumConfigEditForm component
   * Updates data in DB and handles errors
   * @param config - the edited config in the form
   */
  const handleEditSubmit = async (config: AquariumConfiguration) => {
    const updateResult = await AquariumService.updateConfiguration(
      config,
      selectedAquarium.id
    );
    if (updateResult.length > 0) {
      setError(updateResult);
      setEdit(false);
      return;
    }
    alert(strings.successfulUpdate);
    setError("");
    selectedAquarium.config = config;
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
    setLoading(false);
  }, []);

  return (
    <Layout
      navigation={props.navigation}
      shouldDisplayMenuBar={edit ? false : true}
    >
      <AquariumSelectList
        aquariums={props.user.aquariums}
        selectCallback={setSelectedAquarium}
      />
      <ScrollView
        contentContainerStyle={[
          commonStyles.scrollContainer,
          { opacity: edit ? 0.1 : 1 },
        ]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshCallback} />
        }
      >
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

export default ConfiguratorScreen;
