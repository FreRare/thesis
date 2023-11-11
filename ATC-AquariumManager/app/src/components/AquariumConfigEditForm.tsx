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
import * as Sample from "../models/SamplePeriod";
import commonStyles from "../utils/commonStyles";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

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
  const [labelPostFix, setLabelPostFix] = React.useState<string>("");
  const [timePickerFlag, setTimePickerFlag] = React.useState<boolean>(false);
  const [dropdownFlag, setDropdownFlag] = React.useState<boolean>(false);
  const [showDateTimePicker, setShowDateTimePicker] =
    React.useState<boolean>(false);

  const cleanDropdownData: Array<{ key: number; value: string }> = []; // To store data for clean dropdown
  const sampleDropdownData: Array<{ key: number; value: string }> = []; // To store data for sample dropdown

  // Fill dropdowns with data if they're used
  useEffect(() => {
    if (data1 < 0) {
      formDataAndInputDecider();
    }
    if (props.label === strings.cleaning && cleanDropdownData.length <= 0) {
      for (let i = 0; i < Clean.ENUM_LENGTH; i++) {
        cleanDropdownData.push({ key: i, value: Clean.getCleanStringValue(i) });
      }
    }
    if (
      props.label === strings.samplePeriod &&
      sampleDropdownData.length <= 0
    ) {
      for (let i = 0; i < Sample.ENUM_LENGTH; i++) {
        sampleDropdownData.push({ key: i, value: Sample.getStringValue(i) });
      }
    }
  });

  /**
   * Convert the given number from minutes to 24h format clock
   * @param dat the time in minutes (between 0 and 1439)
   */
  const convertMinutesToTimeString = (dat: number) => {
    if (dat >= 1440) {
      dat = 0;
    }
    // Calculate minutes and hours
    const minutes = dat % 60;
    dat -= minutes;
    const hours = dat / 60;
    return String(hours) + ":" + String(minutes);
  };

  /**
   * Sets the data states to the edited fields of the config data
   * Also sets the flags for different input types
   */
  const formDataAndInputDecider = () => {
    switch (props.label) {
      case strings.temperature:
        setData1(props.editableConfig.minTemp);
        setData2(props.editableConfig.maxTemp);
        setLabelPostFix("(°C)");
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

  // This is only used with timepicker -> the outlet config times
  const outletTimePickerOnChange = (
    event: DateTimePickerEvent,
    selectedTime: Date | undefined
  ) => {
    const currentTime = selectedTime;
    if (currentTime) {
      // This data should be saved to config (the minute of the day)
      const selectedTimeAsMinutes =
        currentTime?.getHours() * 60 + currentTime?.getMinutes();
      setData1(selectedTimeAsMinutes);
    }
    setShowDateTimePicker(false);
  };

  const dynamicFormBody = (
    <>
      {!timePickerFlag && !dropdownFlag && (
        <View style={styles.horizontal}>
          <TextInput
            style={commonStyles.input}
            value={String(data1)}
            onChangeText={(t: string) => {
              setData1(t.length > 0 ? Number.parseFloat(t) : 0);
            }}
          />
          <Text style={styles.dash}>-</Text>
          <TextInput
            style={commonStyles.input}
            value={String(data2)}
            onChangeText={(t: string) => {
              setData2(t.length > 0 ? Number.parseFloat(t) : 0);
            }}
          />
        </View>
      )}
      {dropdownFlag && (
        <View style={styles.horizontal}>
          <SelectList
            data={
              props.label === strings.cleaning
                ? cleanDropdownData
                : sampleDropdownData
            }
            save="key"
            setSelected={(k: number) => {
              setData1(k);
            }}
          />
        </View>
      )}
      {timePickerFlag && (
        // This is only generated for the outlet configs
        <View style={styles.horizontal}>
          <TouchableOpacity onPress={() => setShowDateTimePicker(true)}>
            <Text>{convertMinutesToTimeString(data1)}</Text>
          </TouchableOpacity>
          {showDateTimePicker && (
            <DateTimePicker
              is24Hour={true}
              mode="time"
              value={new Date(data1)}
              onChange={outletTimePickerOnChange}
            />
          )}
        </View>
      )}
    </>
  );

  // Sets the provided config's data to the modified one (using decision by the label)
  const handleSubmit = () => {};

  return (
    <View style={styles.container}>
      <View>
        <Text>{strings.configEditLabel + props.aquariumName}</Text>
      </View>
      <View style={styles.horizontal}>
        <Text>{props.label + " " + labelPostFix}:</Text>
      </View>
      {dynamicFormBody}
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
    height: "40%",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
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
