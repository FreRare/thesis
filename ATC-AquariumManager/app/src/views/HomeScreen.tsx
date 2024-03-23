import React from "react";
import Layout from "../components/Layout";
import DataDisplayCircle from "../components/DataDisplayCircle";
import strings from "../../config/strings";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import commonStyles from "../utils/commonStyles";
import User from "../models/User";
import AquariumSelectList from "../components/AquariumSelectList";
import Aquarium from "../models/Aquarium";
import { Dimensions } from "react-native";
import SensorSample from "../models/SensorSample";
import SensorSampleService from "../services/SensorSampleService";
import { LightIntensityToString } from "../models/LightIntensity";

interface HomeScreenProps {
  navigation: any;
  route: any;
  user: User;
}

function HomeScreen(props: HomeScreenProps) {
  const [selectedAquarium, setSelectedAquarium] = React.useState<Aquarium>(
    props.user.aquariums[0]
  );
  const [lastSample, setLastSample] = React.useState<SensorSample>();
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if(!selectedAquarium){
      alert("FATAL: No aquariums for user! This should never happen!");
      return;
    }
    setLoading(true);
    if (!lastSample) {
      SensorSampleService.getSamples(selectedAquarium.id, true).then(
        (samples) => {
          if (typeof samples === "string") {
            alert(samples);
          } else if(samples.length <= 0){
            setLastSample(new SensorSample());
          } else {
            setLastSample(samples[0]);
          }
        }
      );
    }
    setLoading(false);
  });

  const refreshCallback = React.useCallback(async () => {
    setLoading(true);
    const lastSample = await SensorSampleService.getSamples(
      selectedAquarium.id,
      true
    );
    if (typeof lastSample === "string") {
      alert(lastSample);
    } else {
      setLastSample(lastSample[0]);
    }
    setLoading(false);
  }, []);

  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={true}>
      <AquariumSelectList
        aquariums={props.user.aquariums}
        selectCallback={setSelectedAquarium}
      />
      {lastSample && (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshCallback} />
          }
        >
          <View style={styles.horizontalDataContainer}>
            <DataDisplayCircle
              title={strings.temperature}
              data={String(Math.round(lastSample.temp * 10) / 10) + "°C"}
            />
            <DataDisplayCircle
              title={strings.ph}
              data={String(lastSample.ph)}
            />
          </View>
          <View style={styles.horizontalDataContainer}>
            <DataDisplayCircle
              title={strings.light}
              data={LightIntensityToString(lastSample.lightAmount)}
            />
            <DataDisplayCircle
              title={strings.waterLevel}
              data={String(lastSample.waterLvl) + "%"}
            />
          </View>
          <View style={styles.horizontalInfoContainer}>
            <Text>
              {lastSample.sampleTimeStr}
            </Text>
          </View>
        </ScrollView>
      )}
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
  },
  horizontalDataContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 40,
  },
});

export default HomeScreen;
