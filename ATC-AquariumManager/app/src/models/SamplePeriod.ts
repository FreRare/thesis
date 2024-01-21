import strings from "../../config/strings";

const ENUM_LENGTH = 9;

/**
 * @enum {number}
 * The values of different sample periods (ex. 15 minutes, 3 hours)
 */
enum SamplePeriod {
  SAMPLE_15_MIN = 1,
  SAMPLE_30_MIN = 2,
  SAMPLE_1_HOUR = 3,
  SAMPLE_2_HOUR = 4,
  SAMPLE_3_HOUR = 5,
  SAMPLE_6_HOUR = 6,
  SAMPLE_12_HOUR = 7,
  SAMPLE_DAILY = 8,
}

/**
 * Returns the value provided as a string if the enum
 * @see {SamplePeriod}
 * @param val the number in the enum
 * @returns {string} The value as string
 */
const getStringValue = (val: number): string => {
  switch (val) {
    case SamplePeriod.SAMPLE_15_MIN:
      return strings.sample15Min;
    case SamplePeriod.SAMPLE_30_MIN:
      return strings.sample30Min;
    case SamplePeriod.SAMPLE_1_HOUR:
      return strings.sample1Hour;
    case SamplePeriod.SAMPLE_2_HOUR:
      return strings.sample2Hour;
    case SamplePeriod.SAMPLE_3_HOUR:
      return strings.sample3Hour;
    case SamplePeriod.SAMPLE_6_HOUR:
      return strings.sample6Hour;
    case SamplePeriod.SAMPLE_12_HOUR:
      return strings.sample12Hour;
    case SamplePeriod.SAMPLE_DAILY:
      return strings.sampleDaily;
    default:
      return strings.choose;
  }
};

export { getStringValue, ENUM_LENGTH, SamplePeriod };
