import strings from "../../config/strings";
import AquariumsScreen from "../views/AquariumsScreen";
import ConfiguratorScreen from "../views/ConfiguratorScreen";
import HomeScreen from "../views/HomeScreen";
import InfoScreen from "../views/InfoScreen";
import ProfileScreen from "../views/ProfileScreen";
import SettingsScreen from "../views/SettingsScreen";
import StatisticsScreen from "../views/StatisticsScreen";

const NavigationScreens = [
  {
    name: strings.home,
    title: strings.home,
    icon: "home",
    component: HomeScreen,
    displayOnBottom: true,
  },
  {
    name: strings.aquariums,
    title: strings.aquariums,
    icon: "dotchart",
    component: AquariumsScreen,
    displayOnBottom: true,
  },
  {
    name: strings.configs,
    title: strings.configs,
    icon: "tool",
    component: ConfiguratorScreen,
    displayOnBottom: true,
  },
  {
    name: strings.statistics,
    title: strings.statistics,
    icon: "linechart",
    component: StatisticsScreen,
    displayOnBottom: true,
  },
  {
    name: strings.profile,
    title: strings.profile,
    icon: "user",
    component: ProfileScreen,
    displayOnBottom: false,
  },
  {
    name: strings.settings,
    title: strings.settings,
    icon: "setting",
    component: SettingsScreen,
    displayOnBottom: false,
  },
  {
    name: strings.info,
    title: strings.info,
    icon: "infocirlce",
    component: InfoScreen,
    displayOnBottom: false,
  },
];

export default NavigationScreens;
