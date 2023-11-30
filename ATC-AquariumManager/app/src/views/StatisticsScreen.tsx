import { ScrollView } from "react-native";
import React from "react";
import Layout from "../components/Layout";
import User from "../models/User";
import StatisticsChartDisplayer from "../components/StatisticsChartDisplayer";
import Aquarium from "../models/Aquarium";
import AquariumSelectList from "../components/AquariumSelectList";
import commonStyles from "../utils/commonStyles";

type StatisticsScreenProps = {
  navigation: any;
  user: User;
};

function StatisticsScreen(props: StatisticsScreenProps) {
  const [selectedAquarium, setSelectedAquarium] = React.useState<Aquarium>(
    props.user.aquariums[0]
  );

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <AquariumSelectList
        aquariums={props.user.aquariums}
        selectCallback={setSelectedAquarium}
      />
      <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
        <StatisticsChartDisplayer label={"Bezier chart"} data={[]} />
        <StatisticsChartDisplayer label={"Bezier chart"} data={[]} />
        <StatisticsChartDisplayer label={"Bezier chart"} data={[]} />
      </ScrollView>
    </Layout>
  );
}

export default StatisticsScreen;
