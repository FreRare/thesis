import React from "react";
import Aquarium from "../models/Aquarium";
import { View, StyleSheet } from "react-native";
import commonStyles from "../utils/commonStyles";
import { SelectList } from "react-native-dropdown-select-list";
import strings from "../../config/strings";

type AquariumSelectListProps = {
  selectCallback: (val: Aquarium) => void;
  aquariums: Array<Aquarium>;
};

function AquariumSelectList(props: AquariumSelectListProps) {
  const aquariumSelectList: Array<{ key: number; value: string }> = []; // Data for the dropdown list
  React.useEffect(() => {
    if (aquariumSelectList.length <= 0) {
      for (const aq of props.aquariums) {
        aquariumSelectList.push({ key: aq.id, value: aq.name });
      }
    }
  });

  /**
   * Sets the selected useState to the aquarium identified by val
   * @param {number} val the ID of the selected aquarium
   */
  const handleSelect = (val: number) => {
    const foundAQ = props.aquariums.find((aq) => aq.id === val) as Aquarium;
    props.selectCallback(foundAQ);
  };

  return (
    <SelectList
      search={false}
      inputStyles={commonStyles.dropdownListInputStyle}
      boxStyles={commonStyles.dropdownListBoxStyle}
      dropdownStyles={commonStyles.dropdownListDropdownStyles}
      placeholder={strings.aquariumSelctorPlaceholder}
      setSelected={(val: number) => handleSelect(val)}
      data={aquariumSelectList}
      defaultOption={
        props.aquariums.length > 0
          ? {
              key: props.aquariums[0].id,
              value: props.aquariums[0].name,
            }
          : undefined
      }
    />
  );
}

export default AquariumSelectList;
