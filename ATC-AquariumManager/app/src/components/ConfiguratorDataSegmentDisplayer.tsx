import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import strings from "../../config/strings";
import colors from "../../config/colors";

// Stores the labels as a concatenated string for the datasegment labels
// So label.includes can be used to determine the labels for the data
const dataSegmentLabelDecisionMap = [
  {
    labels: strings.temperature + strings.ph,
    data1Label: strings.min,
    data2Label: strings.max,
  },
  {
    labels: strings.outlet1 + strings.outlet2 + strings.outlet3,
    data1Label: strings.on,
    data2Label: strings.off,
  },
  {
    labels: strings.feeding,
    data1Label: strings.time,
    data2Label: strings.portions,
  },
];

// This component usually gets a label and 2 data (min and max or on and off), some cases second data can be null
type ConfiguratorDataSegmentDisplayerProps = {
  label: string;
  data1: number;
  data2: number | null;
};

/** This component displays the segments of the configuration data, usually in pairs for temp or ph
 *If data is single, the second data will be null which case will be dynamically handled
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
  });

  const [dataLabels, setDataLabels] = React.useState<Array<string>>([]);

  return (
    <View style={styles.conatiner}>
      <View style={styles.horizontal}>
        <Text style={styles.label}>{props.label}</Text>
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.dataSegment}>
          <Text style={styles.dataText}>{String(props.data1)}</Text>
          <Text style={styles.dataText}>{dataLabels[0]}</Text>
        </View>
        {props.data2 !== null && (
          <View style={styles.dataSegment}>
            <Text style={styles.dataText}>{String(props.data2)}</Text>
            <Text style={styles.dataText}>{dataLabels[1]}</Text>
          </View>
        )}
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
});

export default ConfiguratorDataSegmentDisplayer;
