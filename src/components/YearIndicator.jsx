import React from "react";
import { getYearSet, getMonthsWithFirstDay, getFirstWeekdayOfMonth } from "../utils/date-utils";
import { getReadableMonthDate, getReadableWeekday } from "../utils/moment-utils";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const YearIndicator = ({selectDate,setSelectDate, selectYear, setSelectYear, setSelectMonths, setTasks, setWeekDay}) => {
    const changeYear = (e) => {
        const selectedYear = e.target.getAttribute('data-year');
        const type = e.target.getAttribute('data-type');

        let relatedYear = (type === "prev") ? parseInt(selectedYear) - 1:  parseInt(selectedYear) + 1;
        setSelectYear(relatedYear);
        setSelectDate(e.target.getAttribute('data-date'));

        let monthsArr = getMonthsWithFirstDay(relatedYear);
        setSelectMonths(monthsArr);

        let month = '01';
        let year = relatedYear;
        let currDate = `${year}-${month}`;
        
        const firstWeekday = getFirstWeekdayOfMonth(month, year);
        setWeekDay(firstWeekday);

        axios
        .get(API_BASE_URL +'get-all-tasks?dt_task_date='+currDate)
        .then((response) => {
            setTasks(response.data);
        })
        .catch((error) => {
            console.log(error);
        });

    }
    
    const yearSet = getYearSet(selectDate);
    
    return(
        <div className="calendar-year">
            <div className="year-container">
                <div className="yearInfo">
                    <span className="previous" data-date={yearSet.prev} data-year={selectYear} data-type="prev" onClick={changeYear}>&#8249;</span>
                    <h1>{selectYear}</h1>
                    <span className="next" data-date={yearSet.next} data-year={selectYear} data-type="next" onClick={changeYear}>&#8250;</span>
                </div>
                <div className="currentDate">
                    <span className="weekDay">{getReadableWeekday(selectDate)},</span>
                    <span className="selectedDate">{getReadableMonthDate(selectDate)}</span>
                </div>
            </div>
        </div>
    )
}

export default YearIndicator;