import React from "react";
import { SectionList, Text, View, StyleSheet } from "react-native";
import Layout from "../components/Layout";
import User from "../models/User";
import strings from "../../config/strings";
import Icon from "react-native-vector-icons/AntDesign";

const INFO_DATA = [
  {
    title: "Home",
    data: [
      "Select the aquarium which's data you want to view",
      "Monitor the current state of the selected aquarium",
    ],
  },
  {
    title: "Aquariums",
    data: [
      "See all the data of your current registered aqauariums",
      "Search in the list of aquariums",
      "Edit any of the listed aquarium's data",
      "Add new aquariums to your list",
      "Only can add aquariums which has one of the ATC systems conencted! (You need to provide an ID for it)",
    ],
  },
  {
    title: "Configurations",
    data: [
      "See all the configurations of your selected aquarium",
      "Select which of your aquariums' configurations you want to see",
      "Edit the different configurations of your selected aquarium",
      "Changes may take a few minutes to be applied!"
    ],
  },
  {
    title: "Statistics",
    data: [
      "Select the aquarium which's statistics you want to see",
      "View the statistics of the selected aquarium including temperatue, Ph, light and water level",
      "You can also set the time interval of the statistics"
    ],
  },
  {
    title: "Profile",
    data: [
      "View your personal data",
      "Edit your data or change your password",
      "Log out of the app",
    ],
  },
  {
    title: "Settings",
    data: ["Here you can manage notifications"],
  },
];

type InfoScreenProps = {
  navigation: any;
  user: User;
};

function InfoScreen(props: InfoScreenProps) {
  return (
    <Layout navigation={props.navigation} shouldDisplayMenuBar={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{strings.info}</Text>
        <Text style={styles.item}>
          {strings.INFO.basicInformation}
        </Text>
        <SectionList
          sections={INFO_DATA}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Icon
                name={item.includes("!") ? "exclamation" : "check"}
                size={20}
              />
              <Text style={styles.item}>{item}</Text>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.titleContainer}>
              <Icon name="rightcircleo" size={20} />
              <Text style={styles.title}>{section.title}</Text>
            </View>
          )}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 5,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 30,
  },
  item: {
    fontStyle: "italic",
    fontSize: 15,
    marginLeft: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default InfoScreen;
