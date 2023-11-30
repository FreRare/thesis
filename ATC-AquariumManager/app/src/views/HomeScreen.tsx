import React from "react";
import Layout from "../components/Layout";
import DataDisplayCircle from "../components/DataDisplayCircle";
import strings from "../../config/strings";
import { View, StyleSheet, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import commonStyles from "../utils/commonStyles";
import User from "../models/User";
import AquariumSelectList from "../components/AquariumSelectList";
import Aquarium from "../models/Aquarium";
import { Dimensions } from "react-native";

interface HomeScreenProps {
  navigation: any;
  route: any;
  user: User;
}

function HomeScreen(props: HomeScreenProps) {
  const [selectedAquarium, setSelectedAquarium] = React.useState<Aquarium>(
    props.user.aquariums[0]
  );

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <AquariumSelectList
        aquariums={props.user.aquariums}
        selectCallback={setSelectedAquarium}
      />
      <View style={styles.container}>
        <View style={styles.horizontalDataContainer}>
          <DataDisplayCircle title={strings.temperature} data="20" />
          <DataDisplayCircle title={strings.ph} data="20" />
        </View>
        <View style={styles.horizontalDataContainer}>
          <DataDisplayCircle title={strings.light} data="20" />
          <DataDisplayCircle title={strings.waterLevel} data="20%" />
        </View>
        <View style={styles.horizontalInfoContainer}>
          <Text>Last measured: 2023.10.23. 12:56</Text>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  horizontalInfoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -50,
  },
  horizontalDataContainer: {
    flex: 1,
    flexDirection: "row",
  },
});

export default HomeScreen;
