import moment from "moment";
import { getMonth, getSpecificDate, getYear } from "./moment-utils";

export const getDaysInMonth = (month, year) => {
  return moment(`${month}-${year}`, "MM-YYYY").daysInMonth();
};

export const getFirstWeekdayOfMonth = (month, year) => {
  return moment(`${month}-${year}`, "MM-YYYY").startOf("month").weekday();
};

export const convertDate = (inputFormat) => {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
};

export const getDatesInMonthDisplay = (month, year, tasks) => {
  const daysInMonth = getDaysInMonth(month, year);
  const result = [];
  let taskStatus = [];

  //Current month's dates
  for (let i = 1; i <= daysInMonth; i++) {
    var currDate = moment(`${month}-${i}-${year}`, "MM-DD-YYYY").toDate();
    let date = moment(currDate, "YYYY/MM/DD").format("YYYY-MM-DD");

    if (tasks.length !== 0) {
      taskStatus = tasks.map((task) => {
        return task.dt_task_date === date ? 1 : 0;
      });
    }
    let status = taskStatus.includes(1) ? 1 : 0;

    result.push({
      date: moment(`${month}-${i}-${year}`, "MM-DD-YYYY").toDate(),
      currentMonth: true,
      taskStatus: status,
    });
  }
  return result;
};

export const getMonthSet = (selectDate) => {
  const month = getMonth(selectDate) + 1;
  const result = {
    current: selectDate,
    prev: getSpecificDate(month - 1, 1, getYear(selectDate)),
    next: getSpecificDate(month + 1, 1, getYear(selectDate)),
  };

  if (month === 1) {
    result.prev = getSpecificDate(12, 1, getYear(selectDate) - 1);
  }

  if (month === 12) {
    result.next = getSpecificDate(1, 1, getYear(selectDate) + 1);
  }
  return result;
};

export const getYearSet = (selectDate) => {
  const result = {
    current: selectDate,
    prev: getSpecificDate(1, 1, getYear(selectDate) - 1),
    next: getSpecificDate(1, 1, getYear(selectDate) + 1),
  };
  return result;
};

export const getMonthsWithFirstDay = (year) => {
  let result = [];
  for (let i = 1; i <= 12; i++) {
    let weekDay = getFirstWeekdayOfMonth(i, year);
    let daysInMonth = getDaysInMonth(i, year);
    result.push({
      weekDay: weekDay,
      month: moment.monthsShort(i - 1),
      daysInMonth: daysInMonth,
      date: moment(`${i}-1-${year}`, "MM-DD-YYYY").toDate(),
    });
  }
  return result;
};

export const getMonthColor = (daysInMonth) => {
  // console.log(daysInMonth)
  let MonthColor = "";
  switch (daysInMonth) {
    case 28:
    case 29:
      MonthColor = "day29color";
      break;
    case 30:
      MonthColor = "day30color";
      break;
    case 31:
      MonthColor = "day31color";
      break;
    default:
      break;
  }
  return MonthColor;
};
