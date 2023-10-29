import React from "react";
import Layout from "../components/Layout";
import DataDisplayCircle from "../components/DataDisplayCircle";
import strings from "../../config/strings";
import { View, StyleSheet } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

interface HomeScreenProps {
  navigation: any;
}

function HomeScreen(props: HomeScreenProps) {
  const [selected, setSelected] = React.useState("");

  const data = [
    { key: "1", value: "My aquarium" },
    { key: "2", value: "My other aquarium" },
  ];

  return (
    <Layout
      navigation={props.navigation}
      shouldDisplayMenuBar={true}
      activeScreen={strings.home}
    >
      <View style={styles.horizontalContainer}>
        <SelectList
          placeholder="Select your aquarium"
          setSelected={(val: string) => setSelected(val)}
          data={data}
          save="value"
        />
      </View>
      <View style={styles.horizontalContainer}></View>
      <View style={styles.horizontalDataContainer}>
        <DataDisplayCircle
          title={strings.temperature}
          data="20"
        ></DataDisplayCircle>
        <DataDisplayCircle title={strings.ph} data="20"></DataDisplayCircle>
      </View>
      <View style={styles.horizontalDataContainer}>
        <DataDisplayCircle title={strings.light} data="20"></DataDisplayCircle>
        <DataDisplayCircle
          title={strings.waterLevel}
          data="20%"
        ></DataDisplayCircle>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flex: 0.6,
  },
  horizontalDataContainer: {
    flex: 1,
    flexDirection: "row",
    margin: 10,
  },
});

export default HomeScreen;
