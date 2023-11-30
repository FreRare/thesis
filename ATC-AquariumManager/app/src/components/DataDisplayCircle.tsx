import React, { ReactElement } from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../config/colors";

interface DataDisplayCircleProps {
  title: string;
  data: string;
}

/**
 * Displays a circle with the provided data
 * @param props
 * @returns - the circle
 */
function DataDisplayCircle(props: DataDisplayCircleProps): React.JSX.Element {
  return (
    <View style={styles.conatiner}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{props.title}</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>{props.data}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    alignItems: "center",
    marginTop: 18,
  },
  titleContainer: {
    alignContent: "center",
    justifyContent: "center",
  },
  dataContainer: {
    borderColor: colors.dataCircleBorder,
    backgroundColor: colors.cardBackGround,
    borderWidth: 10,
    borderRightWidth: 8,
    borderLeftWidth: 8,
    borderTopWidth: 0,
    borderRadius: 50,
    padding: 50,
  },
  titleText: {
    fontSize: 20,
    fontFamily: "sans-serif-medium",
  },
  dataText: {
    fontSize: 30,
  },
});

export default DataDisplayCircle;
