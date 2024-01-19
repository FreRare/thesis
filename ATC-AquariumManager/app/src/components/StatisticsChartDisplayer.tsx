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
  const [chartLabels, setChartLabels] = React.useState<Array<string>>([]);
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
   * Returns how many days are there in the provided month in the given year
   * @param year - the year
   * @param month - the month
   * @returns The number of days
   */
  const getDaysOfTheMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

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
    lastDate.setDate(lastDate.getDate() - daysCount);
    console.log(`All samples count: ${props.data.length}`);
    // Getting samples in date range
    let samplesInDateRange = props.data
      .filter((s) => {
        return s.sampleTime.getTime() <= today.getTime() && s.sampleTime.getTime() > lastDate.getTime();
      })
      .sort(sortSamplesByTimeAscending);
      console.log(`Number of samples for stats: ${samplesInDateRange.length}`);
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
      // Making sure we have some data to display
      if (samplesInDateRange.length <= 0) {
        alert(
          `Not ${props.label} samples found so there are no statistics to display!`
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
      // ! All values should be missing the same number of data, so it's enough to check for one set
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
        labelsBetween.reverse();
        // Labels for after
        const labelsFromAfter = getPastOrUpcomingNDays(
          firstDataDate,
          missingDataFromAfter,
          true
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
        maxValuesArray = Array.from(maxValues.values());
        minValuesArray = Array.from(minValues.values());
        avgValuesArray = Array.from(avgValues.values());
      }
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
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={{ fontSize: 20, color: colors.textPrimary }}>
          {props.label}
        </Text>
      </View>
      {!chartData && <LoadingAnimation />}
      {chartData && !barChartType && (
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
      {chartData && barChartType && (
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
  barPercentage: 0.2,
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
