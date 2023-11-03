import React from "react";
import Aquarium from "../models/Aquarium";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../config/colors";
import strings from "../../config/strings";
import Icon from "react-native-vector-icons/AntDesign";

type AquariumCardProps = {
  navigation: any;
  item: Aquarium;
  setEditing: (edit: boolean) => void;
  setEdited: (aq: Aquarium) => void;
};

function AquariumCard(props: AquariumCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.horizontal}>
        <Text style={{ marginRight: 170 }}>{props.item.name}</Text>
        <Icon
          name="edit"
          size={25}
          onPress={() => {
            props.setEdited(props.item);
            props.setEditing(true);
          }}
        />
      </View>
      <View style={styles.horizontal}>
        <Text>
          {"Dimensions: " +
            [props.item.length, props.item.height, props.item.width].join(
              " * "
            )}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    width: "100%",
    borderWidth: 4,
    borderColor: colors.menuHighlightBG,
    backgroundColor: colors.dataTextBorder,
    borderRadius: 30,
    margin: 15,
    padding: 20,
  },
  horizontal: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});

export default AquariumCard;
