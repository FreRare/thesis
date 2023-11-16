import React from "react";
import Aquarium from "../models/Aquarium";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import { TextInput } from "react-native";
import strings from "../../config/strings";
import commonStyles from "../utils/commonStyles";

type EditAquariumFormProps = {
  aquarium: Aquarium;
  setEditing: (aq: boolean) => void;
  editHandler: (aq: Aquarium) => void;
};

function EditAquariumForm(props: EditAquariumFormProps) {
  const [name, setName] = React.useState(props.aquarium.name);
  const [length, setLength] = React.useState(props.aquarium.length);
  const [height, setHeight] = React.useState(props.aquarium.height);
  const [width, setWidth] = React.useState(props.aquarium.width);
  const [fishCount, setFishCount] = React.useState(props.aquarium.fishCount);

  const confirmHandler = () => {
    props.aquarium.name = name;
    props.aquarium.length = length;
    props.aquarium.height = height;
    props.aquarium.width = width;
    props.editHandler(props.aquarium);
  };

  return (
    <View style={styles.container}>
      <Text>Edit {props.aquarium.name}:</Text>
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
      <TouchableOpacity style={styles.button} onPress={() => confirmHandler()}>
        <Text>{strings.confirm}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => props.setEditing(false)}
      >
        <Text>{strings.cancel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "75%",
    width: "60%",
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
    borderColor: colors.primary,
    borderWidth: 4,
    borderRadius: 50,
    backgroundColor: colors.menuBarBackground,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    padding: "5%",
    margin: "5%",
  },
});

export default EditAquariumForm;
