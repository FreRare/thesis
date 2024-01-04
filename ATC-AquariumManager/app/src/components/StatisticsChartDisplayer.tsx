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
import { Dataset } from "react-native-chart-kit/dist/HelperTypes";

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
    strings.STATS.twoWeeksDataRangeText,
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
    // Find the last sample
    const lastSample = data.reduce((latest, current) => {
      return current.sampleTime.getTime() > latest.sampleTime.getTime()
        ? current
        : latest;
    }, data[0]);
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
   * This function can be used to sort the samples in an array
   * @param a sample A
   * @param b smaple B
   * @returns 1 0 -1 due to the sort order
   */
  const sortSamplesByTimeAscending = (a: SensorSample, b: SensorSample) => {
    if (a.sampleTime.getTime() > b.sampleTime.getTime()) {
      return 1;
    }
    if (a.sampleTime.getTime() < b.sampleTime.getTime()) {
      return -1;
    }
    return 0;
  };

  /**
   * Gets the maximum values for the days
   * @param samples The array of samples to work with (only the data and the time)
   * @returns The values mapped by the dates
   */
  const getMaxDailyValues = (
    samples: Array<{ value: number; time: Date }>
  ): Map<string, number> => {
    // Getting max values per day
    const maxValues = new Map<string, number>();
    samples.forEach((sample) => {
      const dateKey = sample.time.toISOString().split("T")[0];
      if (!maxValues.has(dateKey) || sample.value > maxValues.get(dateKey)!) {
        maxValues.set(dateKey, sample.value);
      }
    });
    return maxValues;
  };

  /**
   * Gets the minimum values for the days
   * @param samples The array of samples to work with (only the data and the time)
   * @returns The values mapped by the dates
   */
  const getMinDailyValues = (samples: Array<{ value: number; time: Date }>) => {
    // Getting min values
    const minValues = new Map<string, number>();
    samples.forEach((sample) => {
      const dateKey = sample.time.toISOString().split("T")[0];
      if (!minValues.has(dateKey) || sample.value < minValues.get(dateKey)!) {
        minValues.set(dateKey, sample.value);
      }
    });
    return minValues;
  };

  /**
   * Gets the average values per day
   * @param samples The array of samples only data and time
   * @returns the average values mapped with the date
   */
  const getAvgDailyValues = (samples: Array<{ value: number; time: Date }>) => {
    // Getting avg values
    const sumValuesByDay = new Map<string, { sum: number; count: number }>();
    samples.forEach((sample) => {
      const dateKey = sample.time.toISOString().split("T")[0];
      if (!sumValuesByDay.has(dateKey)) {
        sumValuesByDay.set(dateKey, { sum: sample.value, count: 1 });
      } else {
        const currentDayValues = sumValuesByDay.get(dateKey);
        if (currentDayValues) {
          currentDayValues.sum += sample.value;
          currentDayValues.count += 1;
        }
      }
    });
    const averageValues = new Map<string, number>();
    sumValuesByDay.forEach((value, day) => {
      averageValues.set(day, value.sum / value.count);
    });
    return averageValues;
  };

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
    }
    return weekLabels;
  };

  /**
   * Generates labels for two days view
   * @returns the labels as an array
   */
  const twoWeeksLabelsGenerator = (): Array<string> => {
    const weekLabels: Array<string> = [];

    const { lastSample, lastDay, lastMonth } = findLastSampleAndDates(
      props.data
    );

    const weekDays: Array<string> = getLastNDays(
      lastDay,
      lastMonth,
      lastSample.sampleTime.getFullYear(),
      14
    );

    weekDays.reverse();
    for (let i = 0; i < weekDays.length; i++) {
      weekLabels.push(weekDays[i]);
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

  // On create initialization of suffixes and dataset
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
        datasets: dataGenerator(1),
      });
    }
  });

  /**
   * Generates the dataset(s) for the charts based on the provided number of days
   * @param daysCount - the number of days
   * @returns The dataset with coloring
   */
  const dataGenerator = (daysCount: number): Array<Dataset> => {
    if ((daysCount > 1 && daysCount < 7) || daysCount > 31) {
      throw Error(
        `Invalid days given to data generator! Cannot generate data for ${daysCount} days!!`
      );
    }
    // Getting the date of today and the day 7 days before
    let today = new Date();
    let lastDate = new Date(today);
    lastDate.setDate(lastDate.getDate() - daysCount);

    // Getting samples in date range
    let samplesInDateRange = props.data
      .filter((s) => {
        return s.sampleTime <= today && s.sampleTime > lastDate;
      })
      .sort(sortSamplesByTimeAscending);

    // Check if we have samples for that time
    if (samplesInDateRange.length <= 0) {
      // If we dont go to the last ones
      alert(
        `No ${props.label} samples found for the past ${daysCount} day(s), showing last available samples!`
      );
      // Recreating time window
      const lastSampleData = findLastSampleAndDates(props.data);
      today = lastSampleData.lastSample.sampleTime;
      lastDate = new Date(lastSampleData.lastSample.sampleTime);
      lastDate.setDate(lastDate.getDate() - daysCount);

      samplesInDateRange = props.data
        .filter((s) => {
          return (
            s.sampleTime.getTime() <= today.getTime() &&
            s.sampleTime.getTime() > lastDate.getTime()
          );
        })
        .sort(sortSamplesByTimeAscending);
    }

    // Getting what values to work with based on the label
    const valuesToWorkWith: Array<{ value: number; time: Date }> = [];
    switch (props.label) {
      case strings.temperature:
        samplesInDateRange.forEach((sample) => {
          valuesToWorkWith.push({
            value: sample.temp,
            time: sample.sampleTime,
          });
        });
        break;
      case strings.ph:
        samplesInDateRange.forEach((sample) => {
          valuesToWorkWith.push({ value: sample.ph, time: sample.sampleTime });
        });
        break;
      case strings.light:
        samplesInDateRange.forEach((sample) => {
          valuesToWorkWith.push({
            value: sample.lightAmount,
            time: sample.sampleTime,
          });
        });
        break;
      case strings.waterLevel:
        samplesInDateRange.forEach((sample) => {
          valuesToWorkWith.push({
            value: sample.waterLvl,
            time: sample.sampleTime,
          });
        });
        break;
    }
    // The final data to return
    const finalDataset = [];
    // Fill out blank points if we have any
    if (daysCount === 1) {
      if (valuesToWorkWith[0].time.getHours() > 0) {
        for (let i = valuesToWorkWith[0].time.getHours(); i >= 0; i--) {
          valuesToWorkWith.unshift(valuesToWorkWith[0]);
        }
      }
      if (valuesToWorkWith[valuesToWorkWith.length - 1].time.getHours() < 23) {
        for (
          let i = valuesToWorkWith[valuesToWorkWith.length - 1].time.getHours();
          i <= 23;
          i++
        ) {
          valuesToWorkWith.push(valuesToWorkWith[valuesToWorkWith.length - 1]);
        }
      }
      const values: number[] = [];
      valuesToWorkWith.forEach((s) => {
        values.push(s.value);
      });
      finalDataset.push({
        data: values,
      });
    } else if (daysCount >= 7) {
      // Get values we want to use
      const maxValues = getMaxDailyValues(valuesToWorkWith);
      const minValues = getMinDailyValues(valuesToWorkWith);
      const avgValues = getAvgDailyValues(valuesToWorkWith);
      // To store the values for the datasets
      const maxValuesArray: number[] = [];
      const minValuesArray: number[] = [];
      const avgValuesArray: number[] = [];
      // Check if we need to fillout blanks
      // Max values holes
      if (maxValues.size < daysCount) {
        const dataDates = Array.from(maxValues.keys()).sort();
        const lastDataDate = new Date(dataDates[0]);
        const firstDataDate = new Date(dataDates[dataDates.length - 1]);
        // Filling up holes before and after
        const missingDataFromBefore = Math.floor(
          (lastDataDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const missingDataFromAfter = Math.floor(
          (today.getTime() - lastDataDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        // Fill up holes before
        for (let i = 0; i < missingDataFromBefore; i++) {
          const valToPut = maxValues.get(
            lastDataDate.toISOString().split("T")[0]
          );
          maxValuesArray.push(valToPut === undefined ? 0 : valToPut);
        }
        // Fill up with data
        for (let i = 0; i < maxValues.size; i++) {
          const valToPut = maxValues.get(dataDates[i]);
          maxValuesArray.push(valToPut === undefined ? 0 : valToPut);
        }
        // Fill up holes after
        for (let i = 0; i < missingDataFromAfter; i++) {
          const valToPut = maxValues.get(
            firstDataDate.toISOString().split("T")[0]
          );
          maxValuesArray.push(valToPut === undefined ? 0 : valToPut);
        }
      }
      if (minValues.size < daysCount) {
        const dataDates = Array.from(minValues.keys()).sort();
        const lastDataDate = new Date(dataDates[0]);
        const firstDataDate = new Date(dataDates[dataDates.length - 1]);
        // Filling up holes before and after
        const missingDataFromBefore = Math.floor(
          (lastDataDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const missingDataFromAfter = Math.floor(
          (today.getTime() - lastDataDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        // Fill up holes before
        for (let i = 0; i < missingDataFromBefore; i++) {
          const valToPut = minValues.get(
            lastDataDate.toISOString().split("T")[0]
          );
          minValuesArray.push(valToPut === undefined ? 0 : valToPut);
        }
        // Fill up with data
        for (let i = 0; i < minValues.size; i++) {
          const valToPut = minValues.get(dataDates[i]);
          minValuesArray.push(valToPut === undefined ? 0 : valToPut);
        }
        // Fill up holes after
        for (let i = 0; i < missingDataFromAfter; i++) {
          const valToPut = minValues.get(
            firstDataDate.toISOString().split("T")[0]
          );
          minValuesArray.push(valToPut === undefined ? 0 : valToPut);
        }
      }
      if (avgValues.size < daysCount) {
        const dataDates = Array.from(avgValues.keys()).sort();
        const lastDataDate = new Date(dataDates[0]);
        const firstDataDate = new Date(dataDates[dataDates.length - 1]);
        // Filling up holes before and after
        const missingDataFromBefore = Math.floor(
          (lastDataDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const missingDataFromAfter = Math.floor(
          (today.getTime() - lastDataDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        // Fill up holes before
        for (let i = 0; i < missingDataFromBefore; i++) {
          const valToPut = avgValues.get(
            lastDataDate.toISOString().split("T")[0]
          );
          avgValuesArray.push(valToPut === undefined ? 0 : valToPut);
        }
        // Fill up with data
        for (let i = 0; i < avgValues.size; i++) {
          const valToPut = avgValues.get(dataDates[i]);
          avgValuesArray.push(valToPut === undefined ? 0 : valToPut);
        }
        // Fill up holes after
        for (let i = 0; i < missingDataFromAfter; i++) {
          const valToPut = avgValues.get(
            firstDataDate.toISOString().split("T")[0]
          );
          avgValuesArray.push(valToPut === undefined ? 0 : valToPut);
        }
      }
      console.log("Max values are: ", maxValuesArray);
      finalDataset.push({
        data: maxValuesArray,
        color: () => "red",
      });
      finalDataset.push({
        data: avgValuesArray,
        color: () => "gray",
      });
      finalDataset.push({
        data: minValuesArray,
        color: () => "blue",
      });
    }

    return finalDataset;
  };

  /**
   * Handles the date range changes
   * Changes the labels and the data of the chart (week and month views have 3 data sets [min-max-avg])
   * @param index - The index of the dateRange choosen
   */
  const dateRangeChanger = (index: number) => {
    switch (index) {
      case 0:
        setChartData({
          labels: dayLabelsGenerator(),
          datasets: dataGenerator(1),
        });
        break;
      case 1:
        setChartData({
          labels: weekLabelsGenerator(),
          datasets: dataGenerator(7),
        });
        break;
      case 2:
        setChartData({
          labels: twoWeeksLabelsGenerator(),
          datasets: dataGenerator(14),
        });
        break;
      case 3:
        setChartData({
          labels: monthLabelsGenerator(),
          datasets: dataGenerator(30),
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
