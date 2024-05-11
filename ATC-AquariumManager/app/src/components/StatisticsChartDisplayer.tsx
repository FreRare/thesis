import React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import colors from "../../config/colors";
import strings from "../../config/strings";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import SensorSample from "../models/SensorSample";
import LoadingAnimation from "./LoadingAnimation";
import { SamplePeriod } from "../models/SamplePeriod";

/**
 * The properties of the component
 * @type {StatisticsChartDisplayerProps}
 * @member label - the label of the chart displayed as Text
 * @member data - the whole data set we're using, we decide later which parts to use
 * @member samplePeriod - The period of how often samples are taken
 */
type StatisticsChartDisplayerProps = {
  label: string;
  data: Array<SensorSample>;
  samplePeriod: SamplePeriod;
};

/**
 * This component can display a chart with the label provided
 * On long press we can choose what period of time we want to see
 * Defaults to last 24 hour's dataset
 * @param props - the label and the data to display
 * @property {StatisticsChartDisplayerProps} - to get an insight on props
 * @returns - The working chart
 */
function StatisticsChartDisplayer(
  props: StatisticsChartDisplayerProps
): React.JSX.Element {
  const [ySuffix, setYSuffix] = React.useState<string>(""); // The suffix for Y axis
  const [chartData, setChartData] = React.useState<LineChartData>(); // The data for the line chart (contains the displayable data and the labels)
  const [highlighted, setHighlighted] = React.useState<number>(0);
  const barChartType =
    props.label === strings.light || props.label === strings.waterLevel;
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
   * Generates the upcoming or past N days as an array of strings
   * @param date The date we want to use as a reference
   * @param N The number of days we want to move
   * @param upcoming Flag if we should move forward, defaults to false
   * @returns The array filled with the needed dates
   */
  const getPastOrUpcomingNDays = (
    date: Date,
    N: number,
    upcoming = false
  ): Array<string> => {
    const days = [];
    const referenceDate = date;
    const tempDate = new Date(referenceDate);
    for (let i = 0; i < N; i++) {
      tempDate.setDate(
        upcoming ? tempDate.getDate() + 1 : tempDate.getDate() - 1
      );
      days.push(`${monthList[tempDate.getMonth()]}-${tempDate.getDate()}`);
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
   * Fills up the missing holes in the array
   * @param before The number of data missing from before
   * @param after The number of data missing from after
   * @param values The values we have
   * @param dates The dates of the data members in the set
   * @param lastDate  The last date we want data for
   * @param firstDate The first date we want data for
   * @returns The array full of data for the needed time window
   */
  const fillMissingDataHoles = (
    before: number,
    after: number,
    values: Map<string, number>,
    dates: Array<string>,
    lastDate: Date,
    firstDate: Date
  ): Array<number> => {
    const resultArray = [];

    // Fill up holes before
    for (let i = 0; i < before; i++) {
      const valToPut = values.get(lastDate.toISOString().split("T")[0]);
      resultArray.push(valToPut === undefined ? 0 : valToPut);
    }
    // Fill up with data
    for (let i = 0; i < values.size; i++) {
      const valToPut = values.get(dates[i]);
      resultArray.push(valToPut === undefined ? 0 : valToPut);
    }
    // Fill up holes after
    for (let i = 0; i < after; i++) {
      const valToPut = values.get(firstDate.toISOString().split("T")[0]);
      resultArray.push(valToPut === undefined ? 0 : valToPut);
    }
    return resultArray;
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
      dataGenerator(1);
    }
  });

  /**
   * Generates the dataset(s) for the charts based on the provided number of days
   * It's designed not to generate data between 2-6 days //! (1 and 7+ are supported in case of invalid days an error is thrown!)
   * In case of 7+ days it generates 3 different sets with MAX-AVG-MIN values per day colored with red-gray-blue
   * It also generates the labels based on where we have the last data, uses the chartData useState to update the values
   * @param daysCount - the number of days
   */
  const dataGenerator = (daysCount: number) => {
    if ((daysCount > 1 && daysCount < 7) || daysCount > 31) {
      throw Error(
        `Invalid days given to data generator! Cannot generate data for ${daysCount} days!!`
      );
    }
    // Getting the date of today and the day 7 days before
    let today = new Date();
    let lastDate = new Date(today);
    if (daysCount == 1) {
      today.setHours(23, 59, 59, 999);
      lastDate.setHours(0, 0, 0, 0);
    } else {
      lastDate.setDate(lastDate.getDate() - daysCount);
    }
    // Getting samples in date range
    let samplesInDateRange = props.data
      .filter((s) => {
        return (
          s.sampleTime.getTime() <= today.getTime() &&
          s.sampleTime.getTime() > lastDate.getTime()
        );
      })
      .sort(sortSamplesByTimeAscending);
    // Check if we have samples for that time
    if (samplesInDateRange.length <= 0) {
      // If we dont go to the last ones
      // Recreating time window
      const lastSampleData = findLastSampleAndDates(props.data);
      today = lastSampleData.lastSample.sampleTime;
      lastDate = new Date(lastSampleData.lastSample.sampleTime);
      lastDate.setDate(lastDate.getDate() - daysCount);
      alert(
        `No ${props.label} samples found for the past ${daysCount} day(s), showing last available samples (${today})!`
      );

      samplesInDateRange = props.data
        .filter((s) => {
          return (
            s.sampleTime.getTime() <= today.getTime() &&
            s.sampleTime.getTime() > lastDate.getTime()
          );
        })
        .sort(sortSamplesByTimeAscending);
      // Making sure we have some data to display
      if (samplesInDateRange.length <= 0) {
        alert(
          `No ${props.label} samples found so there are no statistics to display!`
        );
        return [
          {
            data: [],
          },
        ];
      }
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
    let labels: Array<string> = [];
    // Fill out blank points if we have any
    if (daysCount === 1) {
      // If we have less values than needed and fill out the holes based on the sample period
      let valueCount = 23;
      switch (props.samplePeriod) {
        case SamplePeriod.SAMPLE_15_MIN:
          valueCount = 96;
          break;
        case SamplePeriod.SAMPLE_30_MIN:
          valueCount = 48;
          break;
        case SamplePeriod.SAMPLE_1_HOUR:
          valueCount = 24;
          break;
        case SamplePeriod.SAMPLE_2_HOUR:
          valueCount = 12;
          break;
        case SamplePeriod.SAMPLE_3_HOUR:
          valueCount = 8;
          break;
        case SamplePeriod.SAMPLE_6_HOUR:
          valueCount = 4;
          break;
        case SamplePeriod.SAMPLE_12_HOUR:
          valueCount = 2;
          break;
        case SamplePeriod.SAMPLE_DAILY:
          valueCount = 1;
          break;
        default:
          break;
      }
      const timeDiff = 1 / (valueCount / 24);
      // Missing values from before if first sample's hour is larger than 0
      if (valuesToWorkWith[0].time.getHours() - timeDiff > 0) {
        for (
          let i = valuesToWorkWith[0].time.getHours() - timeDiff;
          i >= 0 + timeDiff;
          i -= timeDiff
        ) {
          valuesToWorkWith.unshift(valuesToWorkWith[0]);
        }
      }
      if (
        valuesToWorkWith[valuesToWorkWith.length - 1].time.getHours() +
          timeDiff <
        24
      ) {
        for (
          let i =
            valuesToWorkWith[valuesToWorkWith.length - 1].time.getHours() +
            timeDiff;
          i < 24;
          i += timeDiff
        ) {
          valuesToWorkWith.push(valuesToWorkWith[valuesToWorkWith.length - 1]);
        }
      }
      // Convert to num array
      const values: number[] = [];
      valuesToWorkWith.forEach((s) => {
        values.push(s.value);
      });
      finalDataset.push({
        data: values,
      });
      console.log(
        props.label,
        "Displayable values are (",
        values.length,
        ") :",
        values
      );
      for (let i = 0; i < 24; i++) {
        labels.push(`${i < 10 ? "0" + i : i}:00`);
      }
    } else if (daysCount >= 7) {
      // Get values we want to use
      const maxValues = getMaxDailyValues(valuesToWorkWith);
      const minValues = getMinDailyValues(valuesToWorkWith);
      const avgValues = getAvgDailyValues(valuesToWorkWith);
      // To store the values for the datasets
      let maxValuesArray: number[] = [];
      let minValuesArray: number[] = [];
      let avgValuesArray: number[] = [];
      // Check if we need to fillout blanks
      // ! All values should be missing the same number of data, so it's enough to check on one set
      // Fill out the holes if we have any
      if (maxValues.size < daysCount) {
        const dataDates = Array.from(maxValues.keys()).sort();
        const lastDataDate = new Date(dataDates[0]);
        const firstDataDate = new Date(dataDates[dataDates.length - 1]);
        // Filling up holes before and after
        const missingDataFromBefore = Math.floor(
          (lastDataDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const missingDataFromAfter = Math.floor(
          (today.getTime() - firstDataDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        console.log(
          `Missing values from max! Before: ${missingDataFromBefore}, After: ${missingDataFromAfter}`
        );
        // Get labels for before
        const labelsFromBefore = getPastOrUpcomingNDays(
          lastDataDate,
          missingDataFromBefore
        ).reverse();
        const labelsBetween: Array<string> = [];
        maxValues.forEach((value, day) => {
          const date = new Date(day);
          labelsBetween.push(`${monthList[date.getMonth()]}-${date.getDate()}`);
        });
        // Labels for after
        const labelsFromAfter = getPastOrUpcomingNDays(
          firstDataDate,
          missingDataFromAfter,
          true
        );
        console.log(
          "Before labels: ",
          labelsFromBefore,
          " Between labels: ",
          labelsBetween,
          " After Labels: ",
          labelsFromAfter
        );
        labels = labelsFromBefore.concat(labelsBetween, labelsFromAfter);
        maxValuesArray = fillMissingDataHoles(
          missingDataFromBefore,
          missingDataFromAfter,
          maxValues,
          dataDates,
          lastDataDate,
          firstDataDate
        );
        minValuesArray = fillMissingDataHoles(
          missingDataFromBefore,
          missingDataFromAfter,
          minValues,
          dataDates,
          lastDataDate,
          firstDataDate
        );
        avgValuesArray = fillMissingDataHoles(
          missingDataFromBefore,
          missingDataFromAfter,
          avgValues,
          dataDates,
          lastDataDate,
          firstDataDate
        );
      } else {
        //Otherwise just set the labels and the values
        labels = [];
        maxValues.forEach((value, day) => {
          const date = new Date(day);
          labels.push(`${monthList[date.getMonth()]}-${date.getDate()}`);
        });
        maxValuesArray = Array.from(maxValues.values());
        minValuesArray = Array.from(minValues.values());
        avgValuesArray = Array.from(avgValues.values());
      }
      console.log("======[ Final data sets are ready ]=====");
      console.log(
        "Maxes: ",
        maxValuesArray,
        "Mins: ",
        minValuesArray,
        "Avgs: ",
        avgValuesArray
      );
      // Setting up final data set
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
    setChartData({
      labels: labels,
      datasets: finalDataset,
    });
  };

  /**
   * Handles the date range changes
   * Changes the labels and the data of the chart
   * @param index - The index of the dateRange choosen
   */
  const dateRangeChanger = (index: number) => {
    switch (index) {
      case 0:
        dataGenerator(1);
        break;
      case 1:
        dataGenerator(7);
        break;
      case 2:
        dataGenerator(14);
        break;
      case 3:
        dataGenerator(30);
    }
    setHighlighted(index);
  };

  // The selector for date ranges (day, week, month)
  const dateRangeSelector = dataViewOptions.map((item, index) => {
    if (barChartType && index > 0) {
      return;
    }
    return (
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
    );
  });

  return (
    <>
      {!chartData && <LoadingAnimation />}
      {chartData && (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={{ fontSize: 20, color: colors.textPrimary }}>
              {props.label}
            </Text>
          </View>
          {!barChartType && (
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
          {barChartType && (
            <BarChart
              data={chartData}
              width={Dimensions.get("window").width - 10}
              height={260}
              verticalLabelRotation={280}
              yAxisSuffix={ySuffix}
              yAxisLabel=""
              xLabelsOffset={20}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          )}
          <View style={styles.dateRangeSelectorContainer}>
            {dateRangeSelector}
          </View>
        </View>
      )}
    </>
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
    stroke: colors.darkThird,
  },
  barPercentage: 0.2,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  chart: {
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.secondary,
  },
  title: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
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
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
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
