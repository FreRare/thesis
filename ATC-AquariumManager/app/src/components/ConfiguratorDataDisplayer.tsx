import React from "react";
import AquariumConfiguration from "../models/AquariumConfiguration";
import { StyleSheet, Dimensions } from "react-native";
import strings from "../../config/strings";
import ConfiguratorDataSegmentDisplayer from "./ConfiguratorDataSegmentDisplayer";
import { View, Text } from "react-native-animatable";
import colors from "../../config/colors";

type ConfiguratorDataDisplayerProps = {
  aquariumConfigData: AquariumConfiguration;
  editCallback: (label: string) => void;
  editDisabled: boolean;
};

function ConfiguratorDataDisplayer(props: ConfiguratorDataDisplayerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.modifiedDateText}>
        {strings.lastModified + props.aquariumConfigData.lastModifiedDateString}
      </Text>
      <ConfiguratorDataSegmentDisplayer
        label={strings.temperature}
        data1={props.aquariumConfigData.minTemp}
        data2={props.aquariumConfigData.maxTemp}
        editCallback={props.editCallback}
        editDisabled={props.editDisabled}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.ph}
        data1={props.aquariumConfigData.minPh}
        data2={props.aquariumConfigData.maxPh}
        editCallback={props.editCallback}
        editDisabled={props.editDisabled}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.outlet1}
        data1={props.aquariumConfigData.OnOutlet1}
        data2={props.aquariumConfigData.OffOutlet1}
        editCallback={props.editCallback}
        editDisabled={props.editDisabled}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.outlet2}
        data1={props.aquariumConfigData.OnOutlet2}
        data2={props.aquariumConfigData.OffOutlet2}
        editCallback={props.editCallback}
        editDisabled={props.editDisabled}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.outlet3}
        data1={props.aquariumConfigData.OnOutlet3}
        data2={props.aquariumConfigData.OffOutlet3}
        editCallback={props.editCallback}
        editDisabled={props.editDisabled}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.cleaning}
        data1={props.aquariumConfigData.filterClean}
        data2={props.aquariumConfigData.waterChange}
        editCallback={props.editCallback}
        editDisabled={props.editDisabled}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.feeding}
        data1={props.aquariumConfigData.feedingTime}
        data2={props.aquariumConfigData.foodPortions}
        editCallback={props.editCallback}
        editDisabled={props.editDisabled}
      />
      <ConfiguratorDataSegmentDisplayer
        label={strings.waterAndSmaples}
        data1={props.aquariumConfigData.waterLvlAlert}
        data2={props.aquariumConfigData.samplePeriod}
        editCallback={props.editCallback}
        editDisabled={props.editDisabled}
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
  modifiedDateText: {
    fontSize: 15,
    color: colors.black,
  },
});

export default ConfiguratorDataDisplayer;
