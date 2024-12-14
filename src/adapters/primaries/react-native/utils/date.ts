import { format } from "date-fns";

export default class DateUtils {
  public static getDateFormat(currentDate: Date) {
    return `${format(currentDate, "EEEEEE. dd LLL")}`;
  }
}
