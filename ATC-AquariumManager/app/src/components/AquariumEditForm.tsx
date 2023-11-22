import React from "react";
import Aquarium from "../models/Aquarium";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import colors from "../../config/colors";
import { TextInput } from "react-native";
import strings from "../../config/strings";
import commonStyles from "../utils/commonStyles";

type AquariumEditFormProps = {
  aquarium: Aquarium;
  addNewFlag: boolean;
  setEditing: (aq: boolean) => void;
  editHandler: (aq: Aquarium, deleteFlag: boolean) => void;
};

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

  const confirmHandler = (del?: boolean) => {
    if (del) {
      props.editHandler(props.aquarium, true);
      return;
    }
    if (props.addNewFlag) {
      // Validation
      if (name.length <= 0) {
        setError(strings.missingNameError);
        return;
      }
      // Size validation is handled inside the form
      if (systemId <= 0) {
        setError(strings.missingAquariumIdError);
        return;
      }
    }
    props.aquarium.name = name;
    props.aquarium.length = length;
    props.aquarium.height = height;
    props.aquarium.width = width;
    props.aquarium.fishCount = fishCount;
    props.aquarium.id = systemId; // ID should be the same, or the new given
    props.editHandler(props.aquarium, false);
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
            setLength(t.length > 0 ? Number.parseInt(t) : 0);
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
            setHeight(t.length > 0 ? Number.parseInt(t) : 0);
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
            setWidth(t.length > 0 ? Number.parseInt(t) : 0);
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
            setFishCount(t.length > 0 ? Number.parseInt(t) : 0);
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
              setSystemId(t.length > 0 ? Number.parseInt(t) : 0);
            }}
          />
        </View>
      )}
      {!props.addNewFlag && (
        <TouchableOpacity
          style={[commonStyles.button, { borderColor: "red" }]}
          onPressOut={() => {
            Alert.alert(strings.confirmation, strings.confirmDeleteMessage, [
              { text: strings.no },
              {
                text: strings.yes,
                onPress: () => {
                  confirmHandler(true);
                },
              },
            ]);
          }}
        >
          <Text>{strings.delete}</Text>
        </TouchableOpacity>
      )}
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
  );
}

export default AquariumEditForm;
