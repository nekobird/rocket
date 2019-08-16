// https://cs.uwaterloo.ca/~alopez-o/math-faq/node73.html

export const DAY = ['Sunday', 'Monday', 'Tusday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DAYS_IN_MONTH = [31, [28, 29], 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export class Calendar {
  public static getDayNameFromDate(day, month, year) {
    let yearString = year.toString();
    let Y = parseInt(yearString.substring(yearString.length - 2, yearString.length), 10);
    let C = parseInt(yearString.substring(0, 2), 10);
    let F = day + (13 * month - 1) / 5 + Y + Y / 4 + C / 4 - 2 * C;
    let remainder = F % 7;
    return remainder;
  }

  public static getNumberOfDaysInMonth(month: number, year: number) {
    if (month === 1)
      return this.isLeapYear(year) === true ? DAYS_IN_MONTH[1][0] : DAYS_IN_MONTH[1][0];
    return DAYS_IN_MONTH[month];
  }

  public static isLeapYear(year: number): boolean {
    if (year % 4 === 0) {
      if (year % 400 === 0) return true;
      if (year % 100 === 0) return false;
      return true;
    }
    return false;
  }
}
