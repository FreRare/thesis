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

/**
 *  @type {AquariumConfigEditFormProps}
 *  These are the properties of the AquariumConfigEditForm component
 */
type AquariumConfigEditFormProps = {
  aquariumName: string;
  editableConfig: AquariumConfiguration;
  label: string;
  cancelCallBack: (val: boolean) => void;
  submitCallback: (config: AquariumConfiguration) => void;
};

/**
 * This component is a dynamic form for the configuration edit.
 * Can be used for dual numeric (float), dual TimePicker (hour + minute), dual dropdown list or in unique cases can be customized.
 * It decides which data we want to modify and what kind of inputs we need for it by the label provided.
 * On submit rewrites the provided config property's fields, and calls the callback property.
 * @param props The propeties needed
 * @returns The form dynamically generated with buttons to cancel and submit
 */
function AquariumConfigEditForm(props: AquariumConfigEditFormProps) {
  /**
   * The string that contains all the unique form cases
   * 2 unique ones are feeding and waterLvl+Samples so far
   * ! Important, so the form body can decide which cases not to use the default inputs
   */
  const uniqueFormCases = strings.feeding + strings.samples;

  const [data1, setData1] = React.useState<number | string>(-1);
  const [data2, setData2] = React.useState<number | string>(-1);
  const [labelPostFix, setLabelPostFix] = React.useState<string>(""); // Additional postfix ex. for temperature
  const [additionalInfo, setAdditionalInfo] = React.useState<string>(""); // Additional information to display on form under label
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [timePickerFlag, setTimePickerFlag] = React.useState<boolean>(false); // True if both the input is timepicker (only for outlet configs)
  const [dropdownFlag, setDropdownFlag] = React.useState<boolean>(false); // True if both dropdown input, for cleaning and samplePeriods
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
    if (props.label === strings.samples && sampleDropdownData.length <= 0) {
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
      case strings.samples: // Dropdown
        setData1(props.editableConfig.samplePeriod);
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
      case strings.samples:
        props.editableConfig.samplePeriod = dat1;
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
              keyboardType="numeric"
              value={data1 ? String(data1) : ""}
              onChangeText={(t: string) => {
                setData1(t);
              }}
            />
            <Text style={styles.dash}>-</Text>
            <TextInput
              style={commonStyles.input}
              keyboardType="numeric"
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
              keyboardType="numeric"
              value={data2 ? String(data2) : ""}
              onChangeText={(t: string) => {
                setData2(t);
              }}
            />
          </View>
        </>
      )}
      {props.label === strings.samples && (
        <>
          <View style={commonStyles.horizontal}>
            <Text style={styles.dropdownLabel}>{strings.samplePeriod}:</Text>
            <SelectList
              boxStyles={styles.dropdownBoxStyle}
              data={sampleDropdownData}
              save="key"
              setSelected={(k: number) => {
                console.log("Setting Sample period to: ", k);
                setData1(k);
              }}
              search={false}
            />
          </View>
        </>
      )}
    </>
  );

  /**
   * Validates the form due to what is the label
   * Calls submit handler if all valid
   * @callback handleSubmit
   * Checks for:
   * - valid water level percent (0-100)
   * - valid food portions (alerts a confirmation over 10)
   * - valid temp (0-100)
   * - valid Ph (0-14)
   * - low temp and ph is lower than high value
   */
  const formValidator = async () => {
    // If we had datas as string (float values) validate it, it should only happen on textinputs
    const parsedData1 = Number.parseFloat(data1 as string);
    const parsedData2 = Number.parseFloat(data2 as string);
    if (Number.isNaN(parsedData1) || Number.isNaN(parsedData2)) {
      setErrorMsg(strings.numberParseError);
      return;
    }
    // Make sure of valid portions input
    if (props.label === strings.feeding) {
      if (parsedData2 > 10) {
        await new Promise((resolve, reject)=>{
          Alert.alert(
            strings.confirmFoodPortions,
            strings.confirmFoodPortionsMessage,
            [
              {
                text: strings.no,
                onPress: () => resolve(false),
              },
              {
                text: strings.yes,
                onPress: () => {handleSubmit(parsedData1, parsedData2);resolve(true)},
              },
            ],
            {cancelable: false}
          );
        })
      }
    }
    // Temperature between 0-100
    if (props.label.includes(strings.temperature)) {
      if (
        parsedData1 < 0 ||
        parsedData1 > 100 ||
        parsedData2 < 0 ||
        parsedData2 > 100
      ) {
        setErrorMsg(strings.invalidTemp);
        return;
      }
    }
    // Ph between 0-14
    if (props.label.includes(strings.ph)) {
      if (
        parsedData1 < 0 ||
        parsedData1 > 14 ||
        parsedData2 < 0 ||
        parsedData2 > 14
      ) {
        setErrorMsg(strings.invalidPh);
        return;
      }
    }
    let d1;
    let d2;
    // Temp and ph should be rounded up to 2 decimal and d1 should be lower than d2
    if (
      props.label.includes(strings.temperature) ||
      props.label.includes(strings.ph) ||
      props.label.includes(strings.outlet1) ||
      props.label.includes(strings.outlet2) ||
      props.label.includes(strings.outlet3)
    ) {
      d1 = Math.round((parsedData1 + Number.EPSILON) * 100) / 100;
      d2 = Math.round((parsedData2 + Number.EPSILON) * 100) / 100;
      if (d1 > d2) {
        setErrorMsg(strings.invalidValueLogic);
        return;
      }
    } else {
      d1 = parsedData1;
      d2 = parsedData2;
    }
    handleSubmit(d1, d2);
  };

  /**
   * Handles the submit of the form
   */
  const handleSubmit = (d1: number, d2: number) => {
    // After we have usable data need to decide which member to alter
    configDataManipulationDecider(d1, d2);
    props.editableConfig.lastModifiedDate = new Date();
    props.submitCallback(props.editableConfig);
  };

  return (
    <View style={commonStyles.formContainer}>
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
        <TouchableOpacity style={commonStyles.button} onPress={formValidator}>
          <Text>{strings.confirm}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => props.cancelCallBack(false)}
        >
          <Text>{strings.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
