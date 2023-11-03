import React from "react";
import Aquarium from "../models/Aquarium";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";
import strings from "../../config/strings";

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
        <View style={styles.vertical}>
          <Text style={{ marginRight: "20%" }}>{props.item.name}</Text>
        </View>
        <View style={styles.verticalRight}>
          <Icon
            name="edit"
            size={25}
            onPress={() => {
              props.setEdited(props.item);
              props.setEditing(true);
            }}
          />
        </View>
      </View>
      <View style={styles.horizontal}>
        <Text>
          {"Dimensions: " +
            [props.item.length, props.item.height, props.item.width].join(
              " * "
            ) +
            " ( " +
            String(
              (props.item.length * props.item.height * props.item.width) / 1000
            ) +
            " L)"}
        </Text>
      </View>
      <View style={styles.horizontal}>
        <Text>
          {strings.currentFishCount + ": " + String(props.item.fishCount)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 140,
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
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  vertical: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  verticalRight: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    flexDirection: "column",
  },
});

export default AquariumCard;
