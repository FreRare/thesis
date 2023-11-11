import React from "react";
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
import commonStyles from "../utils/commonStyles";
import { SelectList } from "react-native-dropdown-select-list";

type AquariumConfigEditFormProps = {
  aquariumName: string;
  editableConfig: AquariumConfiguration;
  cancelCallBack: (val: boolean) => void;
  submitCallback: (config: AquariumConfiguration) => void;
};

function AquariumConfigEditForm(props: AquariumConfigEditFormProps) {
  //--------------------------
  // FORM USE-STATES
  //---------------------------
  const [minTemp, setMinTemp] = React.useState<number>(
    props.editableConfig.minTemp
  );
  const [maxTemp, setMaxTemp] = React.useState<number>(
    props.editableConfig.maxTemp
  );
  const [minPh, setMinPh] = React.useState<number>(props.editableConfig.minPh);
  const [maxPh, setMaxPh] = React.useState<number>(props.editableConfig.maxPh);
  const [OnOutlet1, setOnOutlet1] = React.useState<number>(
    props.editableConfig.OnOutlet1
  );
  const [OffOutlet1, setOffOutlet1] = React.useState<number>(
    props.editableConfig.OffOutlet1
  );
  const [OnOutlet2, setOnOutlet2] = React.useState<number>(
    props.editableConfig.OnOutlet2
  );
  const [OffOutlet2, setOffOutlet2] = React.useState<number>(
    props.editableConfig.OffOutlet2
  );
  const [OnOutlet3, setOnOutlet3] = React.useState<number>(
    props.editableConfig.OnOutlet3
  );
  const [OffOutlet3, setOffOutlet3] = React.useState<number>(
    props.editableConfig.OffOutlet3
  );
  const [waterLvlAlert, setWaterLvlAlert] = React.useState<number>(
    props.editableConfig.waterLvlAlert
  );
  const [feedingTime, setFeedingTime] = React.useState<number>(
    props.editableConfig.feedingTime
  );
  const [foodPortions, setFoodPortions] = React.useState<number>(
    props.editableConfig.foodPortions
  );
  const [filterClean, setFilterClean] = React.useState<number>(
    props.editableConfig.filterClean
  );
  const [waterChange, setWaterChange] = React.useState<number>(
    props.editableConfig.waterChange
  );
  const [samplePeriod, setSamplePeriod] = React.useState<number>(
    props.editableConfig.samplePeriod
  );
  //-------------------------------

  const handleSubmit = () => {};

  return (
    <View style={styles.container}>
      <View>
        <Text>{strings.configEditLabel + props.aquariumName}</Text>
      </View>
      <View style={styles.horizontal}>
        <Text>{strings.temperature}:</Text>
        <TextInput
          style={commonStyles.input}
          value={String(minTemp)}
          onChangeText={(val: string) =>
            setMinTemp(val.length > 0 ? Number.parseFloat(val) : 0)
          }
        />
        <Text style={styles.dash}>-</Text>
        <TextInput
          style={commonStyles.input}
          value={String(maxTemp)}
          onChangeText={(val: string) =>
            setMaxTemp(val.length > 0 ? Number.parseFloat(val) : 0)
          }
        />
      </View>
      <View style={styles.horizontal}>
        <Text>{strings.ph}:</Text>
        <TextInput
          style={commonStyles.input}
          value={String(minPh)}
          onChangeText={(val: string) =>
            setMinPh(val.length > 0 ? Number.parseFloat(val) : 0)
          }
        />
        <Text style={styles.dash}>-</Text>
        <TextInput
          style={commonStyles.input}
          value={String(maxPh)}
          onChangeText={(val: string) =>
            setMaxPh(val.length > 0 ? Number.parseFloat(val) : 0)
          }
        />
      </View>
      <View style={styles.horizontal}>
        <Text>{strings.outlet1}:</Text>
        <TextInput style={commonStyles.input} value={String(OnOutlet1)} />
        <Text style={styles.dash}>-</Text>
        <TextInput style={commonStyles.input} value={String(OffOutlet1)} />
      </View>
      <View style={styles.horizontal}>
        <Text>{strings.outlet2}:</Text>
        <TextInput style={commonStyles.input} value={String(OnOutlet2)} />
        <Text style={styles.dash}>-</Text>
        <TextInput style={commonStyles.input} value={String(OffOutlet2)} />
      </View>
      <View style={styles.horizontal}>
        <Text>{strings.outlet3}:</Text>
        <TextInput style={commonStyles.input} value={String(OnOutlet3)} />
        <Text style={styles.dash}>-</Text>
        <TextInput style={commonStyles.input} value={String(OffOutlet3)} />
      </View>
      <View style={styles.horizontal}>
        <Text>{strings.waterLevelAlert}:</Text>
        <TextInput style={commonStyles.input} value={String(waterLvlAlert) + "%"} />
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
