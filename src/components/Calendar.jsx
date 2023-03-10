import React, { useEffect, useState } from "react";
import './Calendar.scss';
import moment from "moment/moment";
import WeekdayIndicator from "./WeekdayIndicator";
import DateIndicator from "./DateIndicator";
import { getMonth, getYear } from "../utils/moment-utils";
import { getFirstWeekdayOfMonth, getMonthsWithFirstDay } from "../utils/date-utils";
import axios from "axios";
import { API_BASE_URL} from "../utils/constants";
import MonthIndicator from "./MonthIndicator";
import YearIndicator from "./YearIndicator";

const Calendar = () => {
    const [selectDate, setSelectDate] = useState(moment().toDate());
    const [selectMonths, setSelectMonths] = useState([]);
    const [selectYear, setSelectYear] = useState(moment().year());
    const [weekDay, setWeekDay] = useState();
    const [tasks, setTasks] = useState([]);
    
    useEffect(()=>{
        //Get tasks details
        let month = getMonth(selectDate) + 1;
        let year = getYear(selectDate);
        let currDate = `${year}-${month}`;

        //Set WeekDays
        const firstWeekday = getFirstWeekdayOfMonth(month, year);
        setWeekDay(firstWeekday);

        //Set Month
        let monthsArr = getMonthsWithFirstDay(selectYear);
        setSelectMonths(monthsArr);

        axios
        .get(API_BASE_URL +'get-all-tasks?dt_task_date='+currDate)
        .then((response) => {
            setTasks(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    },[]);


    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="left-container">
                    <YearIndicator selectDate={selectDate} setSelectDate={setSelectDate} selectMonths={selectMonths} setSelectMonths={setSelectMonths} selectYear={selectYear} setSelectYear={setSelectYear} setTasks={setTasks} setWeekDay={setWeekDay}/>
                </div>
                <div className="right-container">
                    <MonthIndicator setSelectDate={setSelectDate} selectMonths={selectMonths} setTasks={setTasks} weekDay={weekDay}/>
                </div>
            </div>
            <div className="calendar-body">
                <div className="left-container">
                    <DateIndicator selectDate={selectDate} setSelectDate={setSelectDate} tasks={tasks} setTasks={setTasks} />
                </div>
                <div className="right-container">
                    <WeekdayIndicator weekDay={weekDay}/>
                </div>
            </div>
        </div>
    )
}
export default Calendar;

