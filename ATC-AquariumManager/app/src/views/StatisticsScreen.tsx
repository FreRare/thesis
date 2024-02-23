import { RefreshControl, ScrollView } from "react-native";
import React from "react";
import Layout from "../components/Layout";
import User from "../models/User";
import StatisticsChartDisplayer from "../components/StatisticsChartDisplayer";
import Aquarium from "../models/Aquarium";
import AquariumSelectList from "../components/AquariumSelectList";
import commonStyles from "../utils/commonStyles";
import SensorSample from "../models/SensorSample";
import SensorSampleService from "../services/SensorSampleService";
import strings from "../../config/strings";

type StatisticsScreenProps = {
  navigation: any;
  user: User;
};

function StatisticsScreen(props: StatisticsScreenProps) {
  const [selectedAquarium, setSelectedAquarium] = React.useState<Aquarium>(
    props.user.aquariums[0]
  );
  const [samples, setSamples] = React.useState<Array<SensorSample>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  let refreshKey = 0;

  React.useEffect(() => {
    if (samples.length <= 0) {
      setLoading(true);
      // TODO: Not sure if this is good
      const intervalId = setInterval(loadData, 1000);
      while(samples.length == 0){
        continue;
      }
      clearInterval(intervalId);
      setLoading(false);
    }
  });

  const loadData = ()=>{
    SensorSampleService.getSamples(selectedAquarium.id, false).then(
      (samples) => {
        if (typeof samples === "string") {
          alert(samples);
        } else {
          setSamples(samples);
        }
      }
    );
  }

  const refreshCallback = React.useCallback(async () => {
    setLoading(true);
    const samples = await SensorSampleService.getSamples(
      selectedAquarium.id,
      false
    );
    if (typeof samples === "string") {
      alert(samples);
    } else {
      refreshKey++;
      setSamples(samples);
    }
    setLoading(false);
  }, []);

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <AquariumSelectList
        aquariums={props.user.aquariums}
        selectCallback={setSelectedAquarium}
      />
      <ScrollView
        contentContainerStyle={commonStyles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshCallback} />
        }
      >
        {!loading && (
          <>
            <StatisticsChartDisplayer
              key={refreshKey}
              label={strings.temperature}
              data={samples}
            />
            <StatisticsChartDisplayer
              key={refreshKey + 1}
              label={strings.ph}
              data={samples}
            />
            <StatisticsChartDisplayer
              key={refreshKey + 2}
              label={strings.light}
              data={samples}
            />
            <StatisticsChartDisplayer
              key={refreshKey + 3}
              label={strings.waterLevel}
              data={samples}
            />
          </>
        )}
      </ScrollView>
    </Layout>
  );
}

export default StatisticsScreen;
