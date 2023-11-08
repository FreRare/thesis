import React from "react";
import Layout from "../components/Layout";
import { SelectList } from "react-native-dropdown-select-list";
import strings from "../../config/strings";
import { ScrollView, StyleSheet, Dimensions } from "react-native";

type ConfiguratorScreenProps = {
  navigation: any;
};

function ConfiguratorScreen(props: ConfiguratorScreenProps) {
  const [selectedAquarium, setSelectedAquarium] = React.useState<string>("");

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <SelectList
          placeholder={strings.aquariumSelctorPlaceholder}
          setSelected={(val: string) => setSelectedAquarium(val)}
          data={[]}
        />
      </ScrollView>
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
