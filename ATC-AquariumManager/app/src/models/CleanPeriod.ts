import strings from "../../config/strings";
const ENUM_LENGTH = 8;
enum CleanPeriod {
  CLEAN_NEVER = 0,
  CLEAN_5_DAYS = 1,
  CLEAN_1_WEEK = 2,
  CLEAN_2_WEEKS = 3,
  CLEAN_3_WEEKS = 4,
  CLEAN_1_MONTH = 5,
  CLEAN_2_MONTHS = 6,
  CLEAN_3_MONTHS = 7,
}

const getCleanStringValue = (val: number): string => {
  switch (val) {
    case CleanPeriod.CLEAN_NEVER:
      return strings.never;
    case CleanPeriod.CLEAN_5_DAYS:
      return strings.clean5days;
    case CleanPeriod.CLEAN_1_WEEK:
      return strings.cleanWeekly;
    case CleanPeriod.CLEAN_2_WEEKS:
      return strings.clean2weeks;
    case CleanPeriod.CLEAN_3_WEEKS:
      return strings.clean3weeks;
    case CleanPeriod.CLEAN_1_MONTH:
      return strings.cleanMonthly;
    case CleanPeriod.CLEAN_2_MONTHS:
      return strings.clean2Months;
    case CleanPeriod.CLEAN_3_MONTHS:
      return strings.clean3Months;
    default:
      return strings.choose;
  }
};

export { ENUM_LENGTH, getCleanStringValue, CleanPeriod };
