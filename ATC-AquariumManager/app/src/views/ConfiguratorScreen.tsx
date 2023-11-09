import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { SelectList } from "react-native-dropdown-select-list";
import strings from "../../config/strings";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import ConfiguratorDataDisplayer from "../components/ConfiguratorDataDisplayer";
import Aquarium from "../models/Aquarium";
import commonStyles from "../utils/commonStyles";
import Icon from "react-native-vector-icons/AntDesign";
import AquariumConfiguration from "../models/AquariumConfiguration";
import AquariumConfigEditForm from "../components/AquariumConfigEditForm";

type ConfiguratorScreenProps = {
  navigation: any;
};

function ConfiguratorScreen(props: ConfiguratorScreenProps) {
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

  const handleSelect = (val: string) => {
    setSelectedAquarium(aquariums.find((aq) => (aq.name = val)) as Aquarium);
  };

  const handleEditSubmit = (config: AquariumConfiguration) => {
    selectedAquarium.config = config;
    setEdit(false);
  };

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <ScrollView
        contentContainerStyle={[styles.container, { opacity: edit ? 0.1 : 1 }]}
      >
        <View style={styles.horizontal}>
          <SelectList
            search={false}
            inputStyles={commonStyles.dropdownListInputStyle}
            boxStyles={commonStyles.dropdownListBoxStyle}
            dropdownStyles={commonStyles.dropdownListDropdownStyles}
            placeholder={strings.aquariumSelctorPlaceholder}
            setSelected={(val: string) => handleSelect(val)}
            data={aquariumSelectList}
          />
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => setEdit(true)}
          >
            <Text>{strings.edit}</Text>
            <Icon name="form" size={25} />
          </TouchableOpacity>
        </View>
        <ConfiguratorDataDisplayer
          aquariumConfigData={selectedAquarium.config}
        />
      </ScrollView>
      {edit && (
        <AquariumConfigEditForm
          aquariumName={selectedAquarium.name}
          editableConfig={selectedAquarium.config}
          cancelCallBack={setEdit}
          submitCallback={() => handleEditSubmit}
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
  horizontal: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ConfiguratorScreen;
