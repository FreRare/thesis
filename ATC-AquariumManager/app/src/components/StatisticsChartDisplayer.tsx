import React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import colors from "../../config/colors";
import strings from "../../config/strings";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import commonStyles from "../utils/commonStyles";

/**
 * To help decide which suffixes to use due to the label
 */
const chartDecisionMap = [
  {
    label: strings.temperature,
    yAxisSuffix: "°C",
  },
  {
    label: strings.ph,
    yAxisSuffix: " ",
  },
  {
    label: strings.light,
    yAxisSuffix: " ",
  },
  {
    label: strings.waterLevel,
    yAxisSuffix: "%",
  },
];

/**
 * This array holds the options for the data range selector
 */
const dataViewOptions = [
  strings.STATS.dayDataRangeText,
  strings.STATS.weekDataRangeText,
  strings.STATS.monthDataRangeText,
];

/**
 * The properties of the component
 * @member label - the label of the chart displayed as Text
 * @member data - the whole data set we're using, we decide later which parts to use
 */
type StatisticsChartDisplayerProps = {
  label: string;
  data: Array<number>;
};

/**
 * This component can display a chart with the label provided
 * On long press we can choose what period of time we want to see
 * Defaults to last 24 hour's dataset
 * @param props - the label and the data to display
 * @see {StatisticsChartDisplayerProps} - to get an insight on props
 * @returns The touchable chart
 */
function StatisticsChartDisplayer(
  props: StatisticsChartDisplayerProps
): React.JSX.Element {
  const [ySuffix, setYSuffix] = React.useState<string>("");
  const [chartLabels, setChartLabels] = React.useState<Array<string>>([]);
  const [data, setData] = React.useState<Array<number>>(props.data);
  const [chartData, setChartData] = React.useState<LineChartData>();
  const [highlighted, setHighlighted] = React.useState<number>(0);

  React.useEffect(() => {
    // Setting Y axis suffix based on the label
    if (ySuffix.length <= 0) {
      for (const map of chartDecisionMap) {
        if (map.label === props.label) {
          setYSuffix(map.yAxisSuffix);
        }
      }
    }
    // Setting chart labels for default (24 hours)
    if (chartLabels.length <= 0) {
      for (let i = 0; i < 24; i++) {
        chartLabels.push(`${i}:00`);
      }
    }
    // Setting chart config (chart's data and labels)
    if (!chartData) {
      setChartData({
        labels: chartLabels,
        datasets: [
          {
            data: [
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
            ],
          },
        ],
      });
    }
  });

  const dateRangeChanger = (index: number) => {
    // TODO: Set chart data and labels
    setHighlighted(index);
  };

  const dateRangeSelector = dataViewOptions.map((item, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.dateRangeSelectorTouchable,
        highlighted === index
          ? styles.dateRangeSelectorTouchableHighlighted
          : undefined,
      ]}
      onPress={() => dateRangeChanger(index)}
    >
      <Text style={styles.dateRangeSelectorText}>{item}</Text>
    </TouchableOpacity>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>{props.label}</Text>
      </View>
      {chartData && (
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 40}
          height={260}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1}
          verticalLabelRotation={280}
          xLabelsOffset={10}
          chartConfig={chartConfig}
          fromNumber={10}
          bezier
        />
      )}
      <View style={styles.dateRangeSelectorContainer}>{dateRangeSelector}</View>
    </View>
  );
}

const chartConfig = {
  backgroundColor: colors.CHART.background,
  backgroundGradientFrom: colors.CHART.gradientFrom,
  backgroundGradientTo: colors.CHART.gradientTo,
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  propsForDots: {
    r: "3",
    strokeWidth: "3",
    stroke: colors.CHART.stroke,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 8,
  },
  title: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.CHART.dateSelectorBG,
  },
  dateRangeSelectorContainer: {
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: colors.CHART.dateSelectorBG,
  },
  dateRangeSelectorTouchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateRangeSelectorTouchableHighlighted: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.CHART.dateSelectorHighlight,
    borderRadius: 50,
  },
  dateRangeSelectorText: {
    fontStyle: "italic",
  },
});

export default StatisticsChartDisplayer;
