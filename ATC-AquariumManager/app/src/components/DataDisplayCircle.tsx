import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../config/colors";

interface DataDisplayCircleProps {
  title: string;
  data: string;
}

function DataDisplayCircle(props: DataDisplayCircleProps) {
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
    borderColor: colors.dataCircleBorder,
    borderWidth: 15,
    borderRightWidth: 11,
    borderLeftWidth: 11,
    borderTopWidth: 0,
    borderRadius: 50,
    margin: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  titleContainer: {
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: -25,
  },
  dataContainer: {
    marginTop: 30,
  },
  titleText: {
    fontSize: 20,
    fontFamily: "sans-serif-medium",
  },
  dataText: {
    fontSize: 30,
    fontFamily: "Roboto",
  },
});

export default DataDisplayCircle;
