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
import SensorSample from "../models/SensorSample";
import LoadingAnimation from "./LoadingAnimation";

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
 * Returns how many days are there in the provided month in the given year
 * @param year - the year
 * @param month - the month
 * @returns The number of days
 */
const getDaysOfTheMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * Gets the last N days from the given date (d-m-Y, all with numbers)
 * @param lastDay - the day
 * @param lastMonth - the month
 * @param lastYear - the year
 * @returns The list of the dates as (m-d) format (m is with letters)
 */
const getLastNDays = (
  lastDay: number,
  lastMonth: number,
  lastYear: number,
  N: number
): Array<string> => {
  const days = [];
  const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let numberSub = 0; // Stores how many days we should get off the current day
  for (let i = 0; i < N; i++) {
    // If we reach 0 -> we start a new month
    if (lastDay - numberSub === 0) {
      lastMonth -= 1;
      if (lastMonth === 0) {
        lastMonth = 12;
      }
      lastDay = getDaysOfTheMonth(lastYear, lastMonth);
      numberSub = 0; // Reset descender value
    }
    days.push(`${monthList[lastMonth - 1]}-${lastDay - numberSub}`);
    numberSub++;
  }
  return days;
};

/**
 * Finds the last sample in the provided data set by date, and returns the sample and the day and month of measure
 * @param data - the dataset
 * @returns - {sample, day, month} format data
 */
const findLastSampleAndDates = (data: Array<SensorSample>) => {
  console.log("Reducing array: ", data);
  // Find the last sample
  const lastSample = data.reduce((latest, current) => {
    return current.sampleTime.getTime() > latest.sampleTime.getTime()
      ? current
      : latest;
  }, data[0]);
  console.log("Last sample is: ", lastSample);
  // Get the last date's month and day
  let lastMonth = Number.parseInt(
    lastSample.sampleTime.toISOString().split("T")[0].split("-")[1]
  ); // Get m
  let lastDay = Number.parseInt(
    lastSample.sampleTime.toISOString().split("T")[0].split("-")[2]
  ); // Get d
  return { lastSample, lastDay, lastMonth };
};

/**
 * The properties of the component
 * @member label - the label of the chart displayed as Text
 * @member data - the whole data set we're using, we decide later which parts to use
 */
type StatisticsChartDisplayerProps = {
  label: string;
  data: Array<SensorSample>;
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
  const [ySuffix, setYSuffix] = React.useState<string>(""); // The suffix for Y axis
  const [chartData, setChartData] = React.useState<LineChartData>(); // The data for the line chart (contains the displayable data and the labels)
  const [highlighted, setHighlighted] = React.useState<number>(0);

  /**
   * Creates the labels for daily view
   * @returns - the array of strings (0:00 - 23:00)
   */
  const dayLabelsGenerator = (): Array<string> => {
    const dayLabels = [];
    for (let i = 0; i < 24; i++) {
      dayLabels.push(`${i}:00`);
    }
    return dayLabels;
  };

  /**
   * Creates the labels for weekly view
   * @returns - the array of strings (mon - sun, splitting a day into two [0:00 - 12:00])
   */
  const weekLabelsGenerator = (): Array<string> => {
    const weekLabels: Array<string> = [];
    const { lastSample, lastDay, lastMonth } = findLastSampleAndDates(
      props.data
    );
    // Go 7 days back
    const weekDays: Array<string> = getLastNDays(
      lastDay,
      lastMonth,
      lastSample.sampleTime.getFullYear(),
      7
    );
    weekDays.reverse(); // Reverse the list
    for (let i = 0; i < weekDays.length; i++) {
      weekLabels.push(weekDays[i]);
      weekLabels.push("12:00");
    }
    return weekLabels;
  };

  /**
   * Creates the labels for monthly view
   * @returns - the array of strings (past 30 days from the last sample)
   */
  const monthLabelsGenerator = (): Array<string> => {
    // Get the last data
    const { lastSample, lastDay, lastMonth } = findLastSampleAndDates(
      props.data
    );
    // Get last 30 days
    const monthDays = getLastNDays(
      lastDay,
      lastMonth,
      lastSample.sampleTime.getFullYear(),
      30
    );
    monthDays.reverse();
    return monthDays;
  };

  React.useEffect(() => {
    // Setting Y axis suffix based on the label
    if (ySuffix.length <= 0) {
      for (const map of chartDecisionMap) {
        if (map.label === props.label) {
          setYSuffix(map.yAxisSuffix);
        }
      }
    }
    // Setting chart config (chart's data and labels) if we have data to work from
    if (!chartData && props.data.length > 0) {
      setChartData({
        labels: dayLabelsGenerator(),
        datasets: [
          {
            data: dayDataGenerator(),
          },
        ],
      });
    }
  });

  /**
   * Generates the array of data to the date view
   * Gets the last sample and gets the data for the given day and sorts it by time and gets the needed data for the chart based on the label
   * Also fills out the blank areas with the last and first data values
   * @returns - The array of numbers to display, can be more than 24
   */
  const dayDataGenerator = (): Array<number> => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let samplesInDateRange = props.data.filter((s) => {
      return s.sampleTime >= today && s.sampleTime < tomorrow;
    });
    // If we have no samples for today, get last available samples
    if (samplesInDateRange.length <= 0) {
      alert("No samples found for today, displaying last measured samples!");
      // Get last sample and count back a day
      const lastSample = findLastSampleAndDates(props.data);
      const yesterday = new Date(lastSample.lastSample.sampleTime);
      yesterday.setDate(yesterday.getDate() - 1);
      // Filter samples for date ranges and sort by date ascending
      samplesInDateRange = props.data
        .filter((s) => {
          return (
            s.sampleTime.getTime() <=
              lastSample.lastSample.sampleTime.getTime() &&
            s.sampleTime.getTime() > yesterday.getTime()
          );
        })
        .sort((a, b) => {
          if (a.sampleTime.getTime() > b.sampleTime.getTime()) {
            return 1;
          }
          if (a.sampleTime.getTime() < b.sampleTime.getTime()) {
            return -1;
          }
          return 0;
        });
    }
    // Fill out blank points if we have any
    if (samplesInDateRange[0].sampleTime.getHours() > 0) {
      for (let i = samplesInDateRange[0].sampleTime.getHours(); i >= 0; i--) {
        samplesInDateRange.unshift(samplesInDateRange[0]);
      }
    }
    if (
      samplesInDateRange[samplesInDateRange.length - 1].sampleTime.getHours() <
      23
    ) {
      for (
        let i =
          samplesInDateRange[
            samplesInDateRange.length - 1
          ].sampleTime.getHours();
        i <= 23;
        i++
      ) {
        samplesInDateRange.push(
          samplesInDateRange[samplesInDateRange.length - 1]
        );
      }
    }
    const sampleData = [];
    // Switching what to display dou to the label of the chart
    switch (props.label) {
      case strings.temperature:
        for (const sample of samplesInDateRange) {
          sampleData.push(sample.temp);
        }
        break;
      case strings.ph:
        for (const sample of samplesInDateRange) {
          sampleData.push(sample.ph);
        }
        break;
      case strings.light:
        for (const sample of samplesInDateRange) {
          sampleData.push(sample.lightAmount);
        }
        break;
      case strings.waterLevel:
        for (const sample of samplesInDateRange) {
          sampleData.push(sample.waterLvl);
        }
        break;
    }
    return sampleData;
  };

  /**
   * Handles the date range changes
   * Changes the labels and the data of the chart (week and month views have 3 data sets [min-max-avg])
   * @param index - The index of the dateRange choosen
   */
  const dateRangeChanger = (index: number) => {
    // TODO: add valid data
    const dataArray: Array<number> = [];
    switch (index) {
      case 0:
        setChartData({
          labels: dayLabelsGenerator(),
          datasets: [
            {
              data: dayDataGenerator(),
            },
          ],
        });
        break;
      case 1:
        for (let i = 0; i < 14; i++) {
          dataArray.push(Math.random() * 100);
        }
        setChartData({
          labels: weekLabelsGenerator(),
          datasets: [
            {
              data: dataArray,
            },
          ],
        });
        break;
      case 2:
        for (let i = 0; i < 30; i++) {
          dataArray.push(Math.random() * 100);
        }
        setChartData({
          labels: monthLabelsGenerator(),
          datasets: [
            {
              data: dataArray,
            },
          ],
        });
    }
    setHighlighted(index);
  };

  // The selector for date ranges (day, week, month)
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
        <Text style={{ fontSize: 20, color: colors.textPrimary }}>
          {props.label}
        </Text>
      </View>
      {!chartData && <LoadingAnimation />}
      {chartData && (
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 10}
          height={260}
          verticalLabelRotation={280}
          yAxisSuffix={ySuffix}
          xLabelsOffset={20}
          chartConfig={chartConfig}
          withShadow={highlighted === 0}
          style={styles.chart}
          bezier
        />
      )}
      <View style={styles.dateRangeSelectorContainer}>{dateRangeSelector}</View>
    </View>
  );
}

const chartConfig = {
  backgroundColor: colors.third,
  backgroundGradientFrom: colors.third,
  backgroundGradientTo: colors.third,
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(117, 152, 193, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: "2",
    strokeWidth: "2",
    stroke: colors.secondary,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  chart: {
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.secondary,
  },
  title: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.secondary,
    backgroundColor: colors.third,
  },
  dateRangeSelectorContainer: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.secondary,
    backgroundColor: colors.third,
    paddingBottom: 2,
    paddingTop: 2,
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
    backgroundColor: colors.darkThird,
    borderRadius: 50,
  },
  dateRangeSelectorText: {
    fontStyle: "italic",
  },
});

export default StatisticsChartDisplayer;
