import React from "react";
import Layout from "../components/Layout";
import DataDisplayCircle from "../components/DataDisplayCircle";
import strings from "../../config/strings";
import { View, StyleSheet, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import colors from "../../config/colors";
import commonStyles from "../utils/commonStyles";
import { ScrollView } from "react-native";

interface HomeScreenProps {
  navigation: any;
  route: any;
}

function HomeScreen(props: HomeScreenProps) {
  const [selected, setSelected] = React.useState("");

  const data = [
    { key: "1", value: "My aquarium" },
    { key: "2", value: "My other aquarium" },
  ];

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <View style={styles.horizontalSelectContainer}>
        <SelectList
          boxStyles={commonStyles.dropdownListBoxStyle}
          inputStyles={commonStyles.dropdownListInputStyle}
          dropdownStyles={commonStyles.dropdownListDropdownStyles}
          placeholder={strings.aquariumSelctorPlaceholder}
          setSelected={(val: string) => setSelected(val)}
          data={data}
          save="value"
        />
      </View>
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
      <View style={styles.horizontalInfoContainer}>
        <Text>Last measured: 2023.10.23. 12:56</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  horizontalInfoContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
  },
  horizontalSelectContainer: {
    flex: 0.4,
    margin: 30,
    zIndex: 999,
  },
  horizontalDataContainer: {
    flex: 1,
    flexDirection: "row",
    margin: 10,
  },
});

export default HomeScreen;
