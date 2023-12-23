import React from "react";
import Aquarium from "../models/Aquarium";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";
import strings from "../../config/strings";
import commonStyles from "../utils/commonStyles";

type AquariumCardProps = {
  navigation: any;
  item: Aquarium;
  disabled: boolean;
  setEditing: (edit: boolean) => void;
  setEdited: (aq: Aquarium) => void;
};

/**
 * Displays the data of the given item as a card
 * Can be edited by clicking the edit icon, on edit it calls both callbacks with true flag and the item provided in props
 * @param props The properties of the component
 * @returns The card filled up with the props.item aquarium's data
 */
function AquariumCard(props: AquariumCardProps) {
  return (
    <View style={styles.card}>
      <View style={commonStyles.horizontal}>
        <View style={styles.vertical}>
          <Text style={{ marginRight: "20%", fontSize: 20 }}>
            {props.item.name}
          </Text>
        </View>
        <View style={styles.verticalRight}>
          <Icon
            disabled={props.disabled}
            name="form"
            size={25}
            onPress={() => {
              props.setEdited(props.item);
              props.setEditing(true);
            }}
          />
        </View>
      </View>
      <View style={commonStyles.horizontal}>
        <Text>
          {"Dimensions: " +
            [props.item.length, props.item.height, props.item.width].join(
              " * "
            ) +
            " ( " +
            String(props.item.volume) +
            " L)"}
        </Text>
      </View>
      <View style={commonStyles.horizontal}>
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
    borderColor: colors.secondary,
    backgroundColor: colors.third,
    borderRadius: 30,
    margin: 15,
    padding: 15,
  },
  vertical: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  verticalRight: {
    flex: 0.1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    flexDirection: "column",
  },
});

export default AquariumCard;
