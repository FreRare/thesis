import React from "react";
import Aquarium from "../models/Aquarium";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput, Alert } from "react-native";
import strings from "../../config/strings";
import commonStyles from "../utils/commonStyles";

type AquariumEditFormProps = {
  aquarium: Aquarium;
  addNewFlag: boolean;
  setEditing: (aq: boolean) => void;
  editHandler: (aq: Aquarium, del?: boolean) => void;
};

/**
 * A form to add new and edit existing aquariums.
 * props.addNewFlag indicates if we're adding a new aquarium, in that case we need to add the system's ID
 * @param props - the props for the component
 * @returns A form capable to handle update delete or create
 */
function AquariumEditForm(props: AquariumEditFormProps) {
  const [name, setName] = React.useState<string>(props.aquarium.name);
  const [length, setLength] = React.useState<number>(props.aquarium.length);
  const [height, setHeight] = React.useState<number>(props.aquarium.height);
  const [width, setWidth] = React.useState<number>(props.aquarium.width);
  const [fishCount, setFishCount] = React.useState<number>(
    props.aquarium.fishCount
  );
  const [systemId, setSystemId] = React.useState<number>(props.aquarium.id);
  const [error, setError] = React.useState<string>("");

  /**
   * Validates the inputs of the form
   * @returns true on success false otherwise
   */
  const formValidator = (): boolean => {
    // Only on add new
    if (props.addNewFlag) {
      // Size validation is handled inside the form
      if (systemId <= 0) {
        setError(strings.missingAquariumIdError);
        return false;
      }
    }
    // All cases
    if (name.length <= 0) {
      setError(strings.missingNameError);
      return false;
    }
    if (length <= 0 || height <= 0 || width <= 0) {
      setError(strings.invalidDimensionsError);
      return false;
    }
    if (fishCount < 0) {
      setError(strings.invalidFishCountError);
      return false;
    }
    return true;
  };

  /**
   * The function which is called on submit or delete
   * @param del - the flag if we're deleting
   * @returns void every time, but calls the callback on delete and valid creation or update
   */
  const confirmHandler = (del?: boolean) => {
    if (del) {
      props.editHandler(props.aquarium, true);
      return;
    }
    if (!formValidator()) {
      return;
    }
    props.aquarium.name = name;
    props.aquarium.length = length;
    props.aquarium.height = height;
    props.aquarium.width = width;
    props.aquarium.fishCount = fishCount;
    props.aquarium.id = systemId; // ID should be the same, or the new given
    props.editHandler(props.aquarium);
  };

  return (
    <View style={commonStyles.formContainer}>
      <Text>
        {props.addNewFlag
          ? strings.addNewAquarium
          : strings.edit + " " + props.aquarium.name}
        :
      </Text>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <View style={commonStyles.horizontal}>
        <Text>{strings.name}:</Text>
        <TextInput
          placeholder={strings.name}
          style={commonStyles.input}
          value={name}
          onChangeText={(t) => {
            setName(t);
          }}
        />
      </View>
      <View style={commonStyles.horizontal}>
        <Text>{strings.length}:</Text>
        <TextInput
          aria-label="Length"
          placeholder={strings.length}
          style={commonStyles.input}
          value={String(length)}
          inputMode="numeric"
          onChangeText={(t) => {
            setLength(
              t.length > 0 ? (Number.parseInt(t) ? Number.parseInt(t) : 0) : 0
            );
          }}
        />
      </View>
      <View style={commonStyles.horizontal}>
        <Text>{strings.height}:</Text>
        <TextInput
          placeholder={strings.height}
          style={commonStyles.input}
          value={String(height)}
          inputMode="numeric"
          onChangeText={(t) => {
            setHeight(
              t.length > 0 ? (Number.parseInt(t) ? Number.parseInt(t) : 0) : 0
            );
          }}
        />
      </View>
      <View style={commonStyles.horizontal}>
        <Text>{strings.width}:</Text>
        <TextInput
          placeholder={strings.width}
          style={commonStyles.input}
          value={String(width)}
          inputMode="numeric"
          onChangeText={(t) => {
            setWidth(
              t.length > 0 ? (Number.parseInt(t) ? Number.parseInt(t) : 0) : 0
            );
          }}
        />
      </View>
      <View style={commonStyles.horizontal}>
        <Text>{strings.currentFishCount}:</Text>
        <TextInput
          placeholder={strings.currentFishCount}
          style={commonStyles.input}
          value={String(fishCount)}
          inputMode="numeric"
          onChangeText={(t) => {
            setFishCount(
              t.length > 0 ? (Number.parseInt(t) ? Number.parseInt(t) : 0) : 0
            );
          }}
        />
      </View>
      {props.addNewFlag && (
        <View style={commonStyles.horizontal}>
          <Text>{strings.aquariumId}:</Text>
          <TextInput
            placeholder={strings.aquariumId}
            style={commonStyles.input}
            value={String(systemId > 0 ? systemId : "")}
            inputMode="numeric"
            onChangeText={(t) => {
              setSystemId(
                t.length > 0 ? (Number.parseInt(t) ? Number.parseInt(t) : 0) : 0
              );
            }}
          />
        </View>
      )}
      {!props.addNewFlag && (
        <TouchableOpacity
          style={[commonStyles.button, { borderColor: "red" }]}
          onPress={() => {
            Alert.alert(strings.confirm, strings.confirmDeleteMessage, [
              {
                text: strings.no,
              },
              {
                text: strings.yes,
                onPress: () => confirmHandler(true),
              },
            ]);
          }}
        >
          <Text>{strings.delete}</Text>
        </TouchableOpacity>
      )}
      <View style={commonStyles.horizontal}>
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => confirmHandler()}
        >
          <Text>{strings.confirm}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => props.setEditing(false)}
        >
          <Text>{strings.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AquariumEditForm;
