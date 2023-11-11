import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AquariumConfiguration from "../models/AquariumConfiguration";
import colors from "../../config/colors";
import strings from "../../config/strings";
import * as Clean from "../models/CleanPeriod";

type AquariumConfigEditFormProps = {
  aquariumName: string;
  editableConfig: AquariumConfiguration;
  label: string;
  cancelCallBack: (val: boolean) => void;
  submitCallback: (config: AquariumConfiguration) => void;
};

/**
 * This component is a dynamic form for the configuration edit.
 * It decides which data we want to modify and what kind of inputs we need for it by the label provided.
 * On submit rewrites the provided editableConfig's modified fields, and calls the submitCallback, sending the config back to the screen.
 * @param props The propeties needed see @ AquariumConfigEditFormProps
 * @returns The edit form
 */
function AquariumConfigEditForm(props: AquariumConfigEditFormProps) {
  // We have 1 or two data, data2 can be null if we have only 1 (ex. waterLvlAlert)
  // Later still need assign data to the generated input
  const [data1, setData1] = React.useState<number>(-1);
  const [data2, setData2] = React.useState<number | null>(null);
  const [timePickerFlag, setTimePickerFlag] = React.useState<boolean>(false);
  const [dropdownFlag, setDropdownFlag] = React.useState<boolean>(false);

  const cleanDropdownData = []; // To store data for clean dropdown
  useEffect(() => {
    // Fill clean dropdown with the objects
    if (cleanDropdownData.length <= 0) {
      for (let i = 0; i < Clean.ENUM_LENGTH; i++) {
        cleanDropdownData.push({ key: i, value: Clean.getCleanStringValue(i) });
      }
    }
  });

  // Sets the data states to the edited fields of the config data, also sets the flags for different input types
  const formDataAndInputDecider = () => {
    switch (props.label) {
      case strings.temperature:
        setData1(props.editableConfig.minTemp);
        setData2(props.editableConfig.maxTemp);
        break;
      case strings.ph:
        setData1(props.editableConfig.minPh);
        setData2(props.editableConfig.maxPh);
        break;
      case strings.outlet1:
        setData1(props.editableConfig.OnOutlet1);
        setData2(props.editableConfig.OffOutlet1);
        setTimePickerFlag(true);
        break;
      case strings.outlet2:
        setData1(props.editableConfig.OnOutlet2);
        setData2(props.editableConfig.OffOutlet2);
        setTimePickerFlag(true);
        break;
      case strings.outlet3:
        setData1(props.editableConfig.OnOutlet3);
        setData2(props.editableConfig.OffOutlet3);
        setTimePickerFlag(true);
        break;
      case strings.feeding:
        setData1(props.editableConfig.feedingTime);
        setData2(props.editableConfig.foodPortions);
        break;
      case strings.cleaning:
        setData1(props.editableConfig.filterClean);
        setData2(props.editableConfig.waterChange);
        setDropdownFlag(true);
        break;
      case strings.waterLevelAlert:
        setData1(props.editableConfig.waterLvlAlert);
        setData2(null);
        break;
      case strings.samplePeriod:
        setData1(props.editableConfig.samplePeriod);
        setData2(null);
        setDropdownFlag(true);
        break;
    }
  };

  // Sets the provided config's data to the modified one
  const handleSubmit = () => {};

  return (
    <View style={styles.container}>
      <View>
        <Text>{strings.configEditLabel + props.aquariumName}</Text>
      </View>
      <View style={styles.horizontal}>
        <Text>{props.label}:</Text>
      </View>
      <View style={styles.horizontal}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text>{strings.confirm}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.cancelCallBack(false)}
        >
          <Text>{strings.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "90%",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    top: 20,
    borderColor: colors.menuTopBorder,
    borderWidth: 3,
    borderRadius: 20,
    position: "absolute",
    padding: 10,
    backgroundColor: colors.background,
  },
  horizontal: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
    borderColor: colors.primary,
    borderWidth: 4,
    borderRadius: 50,
    backgroundColor: colors.menuBarBackground,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 10,
  },
  dash: {
    fontSize: 30,
  },
});

export default AquariumConfigEditForm;
