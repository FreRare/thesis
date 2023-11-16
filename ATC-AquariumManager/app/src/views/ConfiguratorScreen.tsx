import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { SelectList } from "react-native-dropdown-select-list";
import strings from "../../config/strings";
import { ScrollView, StyleSheet, Dimensions, View } from "react-native";
import ConfiguratorDataDisplayer from "../components/ConfiguratorDataDisplayer";
import Aquarium from "../models/Aquarium";
import commonStyles from "../utils/commonStyles";
import AquariumConfiguration from "../models/AquariumConfiguration";
import AquariumConfigEditForm from "../components/AquariumConfigEditForm";

type ConfiguratorScreenProps = {
  navigation: any;
};

function ConfiguratorScreen(props: ConfiguratorScreenProps) {
  // TODO retrieve data form db
  const aquariums = [
    new Aquarium(1, "My"),
    new Aquarium(2, "AQ"),
    new Aquarium(3, "Valami"),
    new Aquarium(4, "Ez is egy"),
    new Aquarium(5),
    new Aquarium(6),
  ];
  const aquariumSelectList: Array<{ key: number; value: string }> = [];

  useEffect(() => {
    if (aquariumSelectList.length <= 0) {
      for (const aq of aquariums) {
        aquariumSelectList.push({ key: aq.id, value: aq.name });
      }
    }
  });

  // The actual aquarium which's data is displayed
  const [selectedAquarium, setSelectedAquarium] = React.useState<Aquarium>(
    aquariums[0]
  );
  // The flag for editing
  const [edit, setEdit] = React.useState<boolean>(false);
  const [editLabel, setEditLabel] = React.useState<string>("");

  const handleSelect = (val: number) => {
    const foundAQ = aquariums.find((aq) => aq.id === val) as Aquarium;
    setSelectedAquarium(foundAQ);
  };

  const handleEditSubmit = (config: AquariumConfiguration) => {
    selectedAquarium.config = config;
    setSelectedAquarium(selectedAquarium);
    setEdit(false);
  };

  // Sets the editable label true, also displays the form
  const editCallback = (label: string) => {
    setEditLabel(label);
    setEdit(true);
  };

  return (
    <Layout
      navigation={props.navigation}
      shouldDisplayMenuBar={edit ? false : true}
    >
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
          />
        </View>
        <ConfiguratorDataDisplayer
          aquariumConfigData={selectedAquarium.config}
          editCallback={editCallback}
        />
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
