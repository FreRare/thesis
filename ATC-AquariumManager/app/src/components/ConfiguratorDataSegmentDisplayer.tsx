import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import strings from "../../config/strings";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";
import AquariumConfiguration from "../models/AquariumConfiguration";
import { getCleanStringValue } from "../models/CleanPeriod";
import { getStringValue } from "../models/SamplePeriod";
import commonStyles from "../utils/commonStyles";

// Stores the labels as a concatenated string for the datasegment labels
// So label.includes can be used to determine the labels for the data
const dataSegmentLabelDecisionMap = [
  {
    labels: strings.temperature + strings.ph,
    data1Label: strings.min,
    data2Label: strings.max,
    dataFormatter: (dat: number) => {
      return String(dat);
    },
  },
  {
    labels: strings.outlet1 + strings.outlet2 + strings.outlet3,
    data1Label: strings.on,
    data2Label: strings.off,
    dataFormatter: AquariumConfiguration.convertMinutesToTimeString,
  },
  {
    labels: strings.feeding,
    data1Label: strings.time,
    data2Label: strings.portions,
    dataFormatter: (dat: number) => {
      return String(dat);
    },
  },
  {
    labels: strings.cleaning,
    data1Label: strings.filterClean,
    data2Label: strings.waterChange,
    dataFormatter: getCleanStringValue,
  },
  {
    labels: strings.waterAndSmaples,
    data1Label: strings.waterLevelAlert,
    data2Label: strings.samplePeriod,
    dataFormatter: (dat: number) => {
      return String(dat);
    },
  },
];

// This component usually gets a label and 2 data (min and max or on and off), some cases second data can be null
type ConfiguratorDataSegmentDisplayerProps = {
  label: string;
  data1: number;
  data2: number;
  editCallback: (label: string) => void;
};

/** This component displays the segments of the configuration data, usually in pairs for temp or ph
 *  If data is single, the second data will be null which case will be dynamically handled
 *  Also it has an edit icon on it, on pressing it calls the editCallback with the label it has,
 *  so the main screen will know which data we want to edit.
 */
function ConfiguratorDataSegmentDisplayer(
  props: ConfiguratorDataSegmentDisplayerProps
) {
  // selects the label for the data segments based on the title of the segment
  useEffect(() => {
    if (dataLabels.length <= 0) {
      for (const dsm of dataSegmentLabelDecisionMap) {
        if (
          dsm.labels
            .toLocaleLowerCase()
            .includes(props.label.toLocaleLowerCase())
        ) {
          setDataLabels([dsm.data1Label, dsm.data2Label]);
        }
      }
    }

    for (const dsm of dataSegmentLabelDecisionMap) {
      if (
        dsm.labels.toLocaleLowerCase().includes(props.label.toLocaleLowerCase())
      ) {
        setData1ToDisplay(dsm.dataFormatter(props.data1));
        setData2ToDisplay(dsm.dataFormatter(props.data2));
      }
    }

    // Feeding is a special case bc we have time and number
    if (props.label === strings.feeding) {
      setData1ToDisplay(
        AquariumConfiguration.convertMinutesToTimeString(props.data1)
      );
    }
    // Water & samples is a different case too
    if (props.label === strings.waterAndSmaples) {
      setData2ToDisplay(getStringValue(props.data2));
    }
  });
  const [dataLabels, setDataLabels] = React.useState<Array<string>>([]);
  const [data1ToDisplay, setData1ToDisplay] = React.useState<string>(
    String(props.data1)
  );
  const [data2ToDisplay, setData2ToDisplay] = React.useState<string>(
    String(props.data2)
  );

  return (
    <View style={styles.conatiner}>
      <View style={commonStyles.horizontal}>
        <Text style={styles.label}>{props.label}</Text>
        <TouchableOpacity
          style={styles.horizontalRight}
          onPress={() => {
            props.editCallback(props.label);
          }}
        >
          <Icon name="form" size={25} />
        </TouchableOpacity>
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.dataSegment}>
          <Text style={styles.dataText}>{data1ToDisplay}</Text>
          <Text style={styles.dataText}>{dataLabels[0]}</Text>
        </View>
        <View style={styles.dataSegment}>
          <Text style={styles.dataText}>{data2ToDisplay}</Text>
          <Text style={styles.dataText}>{dataLabels[1]}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 10,
    borderWidth: 3,
    borderColor: colors.secondary,
    borderRadius: 20,
    backgroundColor: colors.cardBackGround,
  },
  dataContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    borderColor: colors.textSecondary,
    borderTopWidth: 1.3,
  },
  dataSegment: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginBottom: 5,
    fontSize: 20,
  },
  dataText: {
    fontSize: 17,
    fontStyle: "italic",
  },
  horizontal: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  horizontalRight: {
    flex: 1,
    marginLeft: 20,
    alignItems: "flex-end",
  },
});

export default ConfiguratorDataSegmentDisplayer;
