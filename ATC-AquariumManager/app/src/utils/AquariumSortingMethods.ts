import strings from "../../config/strings";
import Aquarium from "../models/Aquarium";

const sortByName = (a: Aquarium, b: Aquarium) => a.name.localeCompare(b.name);
const sortByLength = (a: Aquarium, b: Aquarium) => {
  return a.length > b.length ? 1 : 0;
};
const sortByHeight = (a: Aquarium, b: Aquarium) => {
  return a.height > b.height ? 1 : 0;
};
const sortByWidth = (a: Aquarium, b: Aquarium) => {
  return a.width > b.width ? 1 : 0;
};

const AquariumSortingMethodsSelectList = [
  { key: "1", value: strings.name },
  { key: "2", value: strings.length },
  { key: "3", value: strings.height },
  { key: "4", value: strings.width },
];

const AquariumSortingMethodsList = [
  { key: strings.name, value: sortByName },
  { key: strings.length, value: sortByLength },
  { key: strings.height, value: sortByHeight },
  { key: strings.width, value: sortByWidth },
];

export default { AquariumSortingMethodsSelectList, AquariumSortingMethodsList };
