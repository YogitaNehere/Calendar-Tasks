import axios from "axios";
import React from "react";
import { getMonthColor } from "../utils/date-utils";
import { getMonth, getYear } from "../utils/moment-utils";
import { API_BASE_URL } from "../utils/constants";

const MonthIndicator = ({setSelectDate, selectMonths, setTasks, weekDay}) => {
    const changeMonth = (monthDate) => {
        setSelectDate(monthDate);
        
        let month = getMonth(monthDate) + 1;
        let year = getYear(monthDate);
        let currDate = `${year}-${month}`;

        axios
        .get(API_BASE_URL +'get-all-tasks?dt_task_date='+currDate)
        .then((response) => {
            setTasks(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    let col = [];
    let j = weekDay;

    for(let i=0; i<=6; i++){
        if(j > 6) j= 0;
        col[i] = selectMonths.filter(month => {
            return month.weekDay === j; 
        });
        j++;
    }

    return (
        <div className="month-indicator">
            {
                col.map((months, index) => {
                    return(
                        <div className="month-sections" key={index}>
                            {
                                months.map((month, key) => {
                                    let MonthColor = getMonthColor(month.daysInMonth);
                                    
                                    return (
                                        <div
                                            className={`month-indicator-icon ${MonthColor}`} 
                                            key={key} 
                                            onClick={()=> changeMonth(month.date)}>
                                            { (month.month).toUpperCase()} 
                                            {/* - {month.weekDay} */}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default MonthIndicator;