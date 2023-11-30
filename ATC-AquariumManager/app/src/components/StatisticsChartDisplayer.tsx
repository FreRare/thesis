import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import colors from "../../config/colors";
import strings from "../../config/strings";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";

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
    yAxisSuffix: "",
  },
  {
    label: strings.light,
    yAxisSuffix: "",
  },
  {
    label: strings.waterLevel,
    yAxisSuffix: "%",
  },
];

/**
 * @enum - to store the different options for data display times
 */
const enum dataViewOptions {
  HOURS_6 = "6 hours",
  HOURS_12 = "12 hours",
  PAST_24_HOURS = "Last 24 hours",
  TODAY = "Today",
  YESTERDAY = "Yesterday",
  PICK_A_DAY = "Pick a date",
  THIS_WEEK = "This week",
  PICK_A_WEEK = "Pick a week",
  THIS_MONTH = "This month",
  PICK_A_MONTH = "Pick a month",
}

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
  const defaultLabels = [];
  for (let i = 0; i < 24; i++) {
    defaultLabels.push(`${i}:00`);
  }
  const defaultChartData = {
    labels: defaultLabels,
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
  };

  const [labels, setLabels] = React.useState<Array<string>>([]);
  const [data, setData] = React.useState<Array<number>>([]);
  const [chartData, setChartData] =
    React.useState<LineChartData>(defaultChartData);

  /**
   * Sets the displayable data to match the choosen dates
   */
  const dataClipper = (val?: Date, val2?: Date) => {
    // TODO: this should use setData to crop the dataset between val and val2's dates
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={() => {
        alert("LONG PRESS");
      }}
    >
      <Text>CHART</Text>
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
        style={styles.chart}
        fromNumber={10}
        bezier
      />
    </TouchableOpacity>
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
  chart: {
    borderRadius: 15,
  },
});

export default StatisticsChartDisplayer;
