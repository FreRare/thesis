import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
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
 * Can be used for dual numeric (float), dual TimePicker (hour + minute), dual dropdown list or in unique cases can be customized
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

  /**
   * Fill dropdowns with data if they're used, decided by the label
   * */
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
      props.label === strings.waterAndSmaples &&
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
        setAdditionalInfo(strings.outletConfigInfo);
        break;
      case strings.outlet2:
        setData1(props.editableConfig.OnOutlet2);
        setData2(props.editableConfig.OffOutlet2);
        setTimePickerFlag(true);
        setAdditionalInfo(strings.outletConfigInfo);
        break;
      case strings.outlet3:
        setData1(props.editableConfig.OnOutlet3);
        setData2(props.editableConfig.OffOutlet3);
        setTimePickerFlag(true);
        setAdditionalInfo(strings.outletConfigInfo);
        break;
      case strings.cleaning:
        setData1(props.editableConfig.filterClean);
        setData2(props.editableConfig.waterChange);
        setDropdownFlag(true);
        break;
      case strings.feeding: // Timepicker + Numeric
        setData1(props.editableConfig.feedingTime);
        setData2(props.editableConfig.foodPortions);
        break;
      case strings.waterAndSmaples: // Numeric + Dropdown
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
   * This is used for all timePickers
   * It sets the used data for the number of minutes retrieved from the picker
   * @param selectedTime The event time from timepicker
   * @param data1Flag The flag if data1 or data2 should be overwritten
   */
  const timePickerOnChange = (
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

  /**
   * The string that contains all the unique form cases
   * 2 unique ones are feeding and waterLvl+Samples so far
   * ! Important, so the form body can decide which cases not to use the default inputs
   */
  const uniqueFormCases = strings.feeding + strings.waterAndSmaples;

  /**
   *  We have 5 cases so far
   *  For easy maintenance and flexibility, later when adding a new config just add it to the InputDecider and the ManipulationDecider
   *  Also custom flags can be added, or implemented flags can be used, the unique cases formBody is decided by label name
   */
  const dynamicFormBody = (
    <>
      {!timePickerFlag &&
        !dropdownFlag &&
        !uniqueFormCases
          .toLocaleLowerCase()
          .includes(props.label.toLocaleLowerCase()) && (
          <View style={commonStyles.horizontal}>
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
          <View style={commonStyles.horizontal}>
            <Text style={styles.dropdownLabel}>{strings.filterClean}:</Text>
            <SelectList
              boxStyles={styles.dropdownBoxStyle}
              data={cleanDropdownData}
              save="key"
              setSelected={(k: number) => {
                setData1(k);
              }}
              search={false}
            />
          </View>
          <View style={commonStyles.horizontal}>
            <Text style={styles.dropdownLabel}>{strings.waterChange}:</Text>
            <SelectList
              boxStyles={styles.dropdownBoxStyle}
              data={cleanDropdownData}
              save="key"
              setSelected={(k: number) => {
                setData2(k);
              }}
              search={false}
            />
          </View>
        </>
      )}
      {timePickerFlag && (
        // This is only generated for the outlet configs
        <View style={commonStyles.horizontal}>
          <TouchableOpacity
            style={styles.clockDisplayer}
            onPress={() => setShowDateTimePicker1(true)}
          >
            <Text style={styles.clockText}>
              {AquariumConfiguration.convertMinutesToTimeString(
                Number.parseFloat(data1 as string)
              )}
            </Text>
          </TouchableOpacity>
          <Text style={styles.dash}>-</Text>
          {showDateTimePicker1 && (
            <DateTimePicker
              is24Hour={true}
              mode="time"
              value={new Date(0)}
              onChange={(event, date) => timePickerOnChange(date, true)}
            />
          )}
          <TouchableOpacity
            style={styles.clockDisplayer}
            onPress={() => setShowDateTimePicker2(true)}
          >
            <Text style={styles.clockText}>
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
              onChange={(event, date) => timePickerOnChange(date, false)}
            />
          )}
        </View>
      )}
      {props.label === strings.feeding && (
        <>
          <View style={commonStyles.horizontal}>
            <Text style={styles.dropdownLabel}>{strings.feedingTime}:</Text>
            <TouchableOpacity
              style={styles.clockDisplayer}
              onPress={() => setShowDateTimePicker1(true)}
            >
              <Text style={styles.clockText}>
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
                onChange={(event, date) => timePickerOnChange(date, true)}
              />
            )}
          </View>
          <View style={commonStyles.horizontal}>
            <Text style={styles.dropdownLabel}>{strings.portions}:</Text>
            <TextInput
              style={commonStyles.input}
              value={data2 ? String(data2) : ""}
              onChangeText={(t: string) => {
                setData2(t);
              }}
            />
          </View>
        </>
      )}
      {props.label === strings.waterAndSmaples && (
        <>
          <View style={commonStyles.horizontal}>
            <Text style={styles.dropdownLabel}>{strings.waterLevel} (%):</Text>
            <TextInput
              style={commonStyles.input}
              value={data1 ? String(data1) : ""}
              onChangeText={(t: string) => {
                setData1(t);
              }}
            />
          </View>
          <View style={commonStyles.horizontal}>
            <Text style={styles.dropdownLabel}>{strings.samplePeriod}:</Text>
            <SelectList
              boxStyles={styles.dropdownBoxStyle}
              data={sampleDropdownData}
              save="key"
              setSelected={(k: number) => {
                setData2(k);
              }}
              search={false}
            />
          </View>
        </>
      )}
    </>
  );

  const formValidator = () => {
    // If we had datas as string (float values) validate it, it should only happen on textinputs
    const parsedData1 = Number.parseFloat(data1 as string);
    const parsedData2 = Number.parseFloat(data2 as string);
    if (Number.isNaN(parsedData1) || Number.isNaN(parsedData2)) {
      setErrorMsg(strings.numberParseError);
      return;
    }
    // validate water level percentage
    if (props.label === strings.waterAndSmaples) {
      if (parsedData1 > 100 || parsedData1 < 0) {
        setErrorMsg(strings.invalidWaterLevel);
        return;
      }
    }
    // Make sure of valid portions input
    if (props.label === strings.feeding) {
      if (parsedData2 > 10) {
        Alert.alert(
          strings.confirmFoodPortions,
          strings.confirmFoodPortionsMessage,
          [
            {
              text: strings.no,
            },
            {
              text: strings.yes,
              onPress: () => handleSubmit(parsedData1, parsedData2),
            },
          ]
        );
      }
    }

    handleSubmit(parsedData1, parsedData2);
  };

  /**
   * Handles the submit of the form
   * Can add extra checks if needed
   */
  const handleSubmit = (d1: number, d2: number) => {
    // After we have usable data need to decide which member to alter
    configDataManipulationDecider(d1, d2);
    props.submitCallback(props.editableConfig);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>{strings.configEditLabel + props.aquariumName}</Text>
      </View>
      <View style={commonStyles.horizontal}>
        <Text>{props.label + " " + labelPostFix}:</Text>
      </View>
      {additionalInfo.length > 0 && (
        <View style={commonStyles.horizontal}>
          <Text>{additionalInfo}</Text>
        </View>
      )}
      <View style={commonStyles.horizontal}>
        <Text style={{ flex: 1, color: "red" }}>{errorMsg}</Text>
      </View>
      {dynamicFormBody}
      <View style={commonStyles.horizontal}>
        <TouchableOpacity style={styles.button} onPress={formValidator}>
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
    padding: 8,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 40,
  },
  clockText: {
    fontSize: 25,
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
