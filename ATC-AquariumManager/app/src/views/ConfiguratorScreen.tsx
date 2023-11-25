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

function ConfiguratorScreen(props: ConfiguratorScreenProps) {
  const [aquariums, setAquariums] = React.useState<Array<Aquarium>>([]);
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
   * Loads the aquariums from database
   */
  const loadAquariums = async () => {
    setLoading(true);
    const loadedAquariums = await AquariumService.getAquariums(
      props.user.email
    );
    if (typeof loadedAquariums === "string") {
      setError(loadedAquariums as string);
    } else {
      setAquariums(loadedAquariums);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (aquariums.length <= 0 && error.length <= 0) {
      loadAquariums();
    }
    if (aquariumSelectList.length <= 0) {
      for (const aq of aquariums) {
        aquariumSelectList.push({ key: aq.id, value: aq.name });
      }
    }
  });

  const aquariumSelectList: Array<{ key: number; value: string }> = [];

  const handleSelect = (val: number) => {
    const foundAQ = aquariums.find((aq) => aq.id === val) as Aquarium;
    setSelectedAquarium(foundAQ);
  };

  // Handles the confirm of the edit form
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

  // Callback from the segments to enable editing
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
