import React from "react";
import AquariumConfiguration from "../models/AquariumConfiguration";
import { StyleSheet, Dimensions } from "react-native";
import strings from "../../config/strings";
import ConfiguratorDataSegmentDisplayer from "./ConfiguratorDataSegmentDisplayer";
import { View } from "react-native-animatable";

type ConfiguratorDataDisplayerProps = {
  aquariumConfigData: AquariumConfiguration;
};

function ConfiguratorDataDisplayer(props: ConfiguratorDataDisplayerProps) {
  return (
    <View style={styles.container}>
      <ConfiguratorDataSegmentDisplayer
        label={strings.temperature}
        data1={props.aquariumConfigData.minTemp}
        data2={props.aquariumConfigData.maxTemp}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.ph}
        data1={props.aquariumConfigData.minPh}
        data2={props.aquariumConfigData.maxPh}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.outlet1}
        data1={props.aquariumConfigData.OnOutlet1}
        data2={props.aquariumConfigData.OffOutlet1}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.outlet2}
        data1={props.aquariumConfigData.OnOutlet2}
        data2={props.aquariumConfigData.OffOutlet2}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.outlet3}
        data1={props.aquariumConfigData.OnOutlet3}
        data2={props.aquariumConfigData.OffOutlet3}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.feeding}
        data1={props.aquariumConfigData.feedingTime}
        data2={props.aquariumConfigData.foodPortions}
      />
    </View>
  );
}

const windowWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default ConfiguratorDataDisplayer;
