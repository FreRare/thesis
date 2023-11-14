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
import DateTimePicker from "@react-native-community/datetimepicker";

type AquariumConfigEditFormProps = {
  aquariumName: string;
  editableConfig: AquariumConfiguration;
  label: string;
  cancelCallBack: (val: boolean) => void;
  submitCallback: (config: AquariumConfiguration) => void;
};

/**
 * This component is a dynamic form for the configuration edit.
 * Can be used for dual numeric (float), dual TimePicker (hour + minute), dual dropdown list or in unique feeding case for dropdown and numeric input
 * It decides which data we want to modify and what kind of inputs we need for it by the label provided.
 * On submit rewrites the provided editableConfig's modified fields, and calls the submitCallback, sending the config back to the screen.
 * @param props The propeties needed see @ AquariumConfigEditFormProps
 * @returns The edit form
 */
function AquariumConfigEditForm(props: AquariumConfigEditFormProps) {
  // We have 1 or two data, data2 can be null if we have only 1 (ex. waterLvlAlert)
  // Later still need assign data to the generated input
  const [data1, setData1] = React.useState<number | string>(-1);
  const [data2, setData2] = React.useState<number | string>(-1);
  const [labelPostFix, setLabelPostFix] = React.useState<string>(""); // Additional postfix ex. for temperature
  const [additionalInfo, setAdditionalInfo] = React.useState<string>("");
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [timePickerFlag, setTimePickerFlag] = React.useState<boolean>(false); // True if the input is timepicler (only for outlet configs)
  const [dropdownFlag, setDropdownFlag] = React.useState<boolean>(false); // True if dropdown input, for cleaning and samplePeriods
  const [showDateTimePicker1, setShowDateTimePicker1] =
    React.useState<boolean>(false);
  const [showDateTimePicker2, setShowDateTimePicker2] =
    React.useState<boolean>(false);

  const cleanDropdownData: Array<{ key: number; value: string }> = []; // To store data for clean dropdown
  const sampleDropdownData: Array<{ key: number; value: string }> = []; // To store data for sample dropdown

  // Fill dropdowns with data if they're used
  useEffect(() => {
    if ((data1 as number) < 0) {
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
      case strings.waterAndSmaples:
        setData1(props.editableConfig.waterLvlAlert);
        setData2(props.editableConfig.samplePeriod);
        break;
    }
  };

  /**
   * Decides which data in the config should be rewritten, and rewrites it
   * @param dat1 the data1 as number
   * @param dat2 the data2 as number
   * @returns void
   */
  const configDataManipulationDecider = (dat1: number, dat2: number) => {
    switch (props.label) {
      case strings.temperature:
        props.editableConfig.minTemp = dat1;
        props.editableConfig.maxTemp = dat2;
        return;
      case strings.ph:
        props.editableConfig.minPh = dat1;
        props.editableConfig.maxPh = dat2;
        return;
      case strings.outlet1:
        props.editableConfig.OnOutlet1 = dat1;
        props.editableConfig.OffOutlet1 = dat2;
        return;
      case strings.outlet2:
        props.editableConfig.OnOutlet2 = dat1;
        props.editableConfig.OffOutlet2 = dat2;
        return;
      case strings.outlet3:
        props.editableConfig.OnOutlet3 = dat1;
        props.editableConfig.OffOutlet3 = dat2;
        return;
      case strings.feeding:
        props.editableConfig.feedingTime = dat1;
        props.editableConfig.foodPortions = dat2;
        return;
      case strings.cleaning:
        props.editableConfig.filterClean = dat1;
        props.editableConfig.waterChange = dat2;
        return;
      case strings.waterAndSmaples:
        props.editableConfig.waterLvlAlert = dat1;
        props.editableConfig.samplePeriod = dat2;
    }
  };

  /**
   * This is only used for outlet timePicker
   * @param selectedTime The event time from timepicker
   * @param data1Flag The flag if data1 or data2 should be overwritten
   */
  const outletTimePickerOnChange = (
    selectedTime: Date | undefined,
    data1Flag: boolean
  ) => {
    const currentTime = selectedTime;
    if (currentTime) {
      // This data should be saved to config (the minute of the day)
      const selectedTimeAsMinutes =
        currentTime?.getHours() * 60 + currentTime?.getMinutes();
      data1Flag
        ? setData1(selectedTimeAsMinutes)
        : setData2(selectedTimeAsMinutes);
    }
    setShowDateTimePicker1(false);
    setShowDateTimePicker2(false);
  };

  const dynamicFormBody = (
    <>
      {!timePickerFlag && !dropdownFlag && (
        <View style={styles.horizontal}>
          <TextInput
            style={commonStyles.input}
            value={data1 ? String(data1) : ""}
            onChangeText={(t: string) => {
              setData1(t);
            }}
          />
          <Text style={styles.dash}>-</Text>
          <TextInput
            style={commonStyles.input}
            value={data2 ? String(data2) : ""}
            onChangeText={(t: string) => {
              setData2(t);
            }}
          />
        </View>
      )}
      {dropdownFlag && (
        // This is only on cleaning
        <>
          <View style={styles.horizontal}>
            <Text style={styles.dropdownLabel}>{strings.filterClean}:</Text>
            <SelectList
              boxStyles={styles.dropdownBoxStyle}
              data={cleanDropdownData}
              save="key"
              setSelected={(k: number) => {
                setData1(k);
              }}
            />
          </View>
          <View style={styles.horizontal}>
            <Text style={styles.dropdownLabel}>{strings.waterChange}:</Text>
            <SelectList
              boxStyles={styles.dropdownBoxStyle}
              data={cleanDropdownData}
              save="key"
              setSelected={(k: number) => {
                setData2(k);
              }}
            />
          </View>
        </>
      )}
      {timePickerFlag && (
        // This is only generated for the outlet configs
        <View style={styles.horizontal}>
          <TouchableOpacity
            style={styles.clockDisplayer}
            onPress={() => setShowDateTimePicker1(true)}
          >
            <Text>
              {AquariumConfiguration.convertMinutesToTimeString(
                Number.parseFloat(data1 as string)
              )}
            </Text>
          </TouchableOpacity>
          {showDateTimePicker1 && (
            <DateTimePicker
              is24Hour={true}
              mode="time"
              value={new Date(0)}
              onChange={(event, date) => outletTimePickerOnChange(date, true)}
            />
          )}
          <TouchableOpacity
            style={styles.clockDisplayer}
            onPress={() => setShowDateTimePicker2(true)}
          >
            <Text>
              {AquariumConfiguration.convertMinutesToTimeString(
                Number.parseFloat(data2 as string)
              )}
            </Text>
          </TouchableOpacity>
          {showDateTimePicker2 && (
            <DateTimePicker
              is24Hour={true}
              mode="time"
              value={new Date(0)}
              onChange={(event, date) => outletTimePickerOnChange(date, false)}
            />
          )}
        </View>
      )}
    </>
  );

  // Sets the provided config's data to the modified one (using decision by the label)
  const handleSubmit = () => {
    // If we had datas as string (float values) validate it, it should only happen on textinputs
    const parsedData1 = Number.parseFloat(data1 as string);
    const parsedData2 = Number.parseFloat(data2 as string);
    if (Number.isNaN(parsedData1) || Number.isNaN(parsedData2)) {
      setErrorMsg(strings.numberParseError);
      return;
    }
    // After we have usable data need to decide which member to alter
    configDataManipulationDecider(parsedData1, parsedData2);
    props.submitCallback(props.editableConfig);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>{strings.configEditLabel + props.aquariumName}</Text>
      </View>
      <View style={styles.horizontal}>
        <Text>{props.label + " " + labelPostFix}:</Text>
      </View>
      <View style={styles.horizontal}>
        <Text>{additionalInfo}</Text>
      </View>
      <View style={styles.horizontal}>
        <Text style={{ flex: 1, color: "red" }}>{errorMsg}</Text>
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
    flex: 1,
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
  clockDisplayer: {
    marginHorizontal: 20,
    padding: 5,
    borderWidth: 2,
  },
  dropdownBoxStyle: {
    flex: 1,
    margin: 5,
    backgroundColor: colors.menuBarBackground,
  },
  dropdownLabel: {
    flex: 1,
  },
});

export default AquariumConfigEditForm;
