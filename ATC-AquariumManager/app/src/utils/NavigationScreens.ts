import strings from "../../config/strings";
import AquariumsScreen from "../views/AquariumsScreen";
import ConfiguratorScreen from "../views/ConfiguratorScreen";
import HomeScreen from "../views/HomeScreen";
import ProfileScreen from "../views/ProfileScreen";
import StatisticsScreen from "../views/StatisticsScreen";

const NavigationScreens = [
  {
    name: strings.aquariums,
    title: strings.aquariums,
    icon: "dotchart",
    component: AquariumsScreen,
  },
  {
    name: strings.configs,
    title: strings.configs,
    icon: "tool",
    component: ConfiguratorScreen,
  },
  {
    name: strings.home,
    title: strings.home,
    icon: "home",
    component: HomeScreen,
  },
  {
    name: strings.statistics,
    title: strings.statistics,
    icon: "linechart",
    component: StatisticsScreen,
  },
  {
    name: strings.profile,
    title: strings.profile,
    icon: "user",
    component: ProfileScreen,
  },
];

export default NavigationScreens;
