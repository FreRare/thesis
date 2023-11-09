import React, { useEffect, useRef } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";
import * as Animatable from "react-native-animatable";

function MenuBarButton(props: any) {
  const { item, onPress, accessibilityState } = props;
  const { selected } = accessibilityState;

  const viewRef = useRef(null);
  const textRef = useRef(null);
  const iconRef = useRef(null);

  const inSelectAnim = { 0: { scale: 0 }, 1: { scale: 1 } };
  const outSelectAnim = { 0: { scale: 1 }, 1: { scale: 0 } };

  useEffect(() => {
    if (selected) {
      viewRef.current?.animate(inSelectAnim); //* Works just fine
      textRef.current?.animate(inSelectAnim);
      iconRef.current?.animate(inSelectAnim);
    } else {
      viewRef.current?.animate(outSelectAnim);
      textRef.current?.animate(outSelectAnim);
    }
  }, [selected]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[
        styles.container,
        {
          flex: selected ? 1 : 0.6,
          display: item.displayOnBottom ? "flex" : "none",
        },
      ]}
    >
      <View>
        <Animatable.View
          ref={viewRef}
          duration={500}
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: selected
                ? colors.menuHighlightBG
                : colors.menuBarBackground,
              borderRadius: 10,
              margin: -10,
            },
          ]}
        />
        <View style={styles.navButton}>
          <Animatable.View ref={iconRef}>
            <Icon
              name={item.icon as string}
              size={30}
              color={selected ? colors.menuBarBackground : colors.secondary}
            />
          </Animatable.View>
          <Animatable.View ref={textRef}>
            {selected && (
              <Text style={{ color: colors.textPrimary, paddingHorizontal: 6 }}>
                {item.name}
              </Text>
            )}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navButton: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
export default MenuBarButton;
