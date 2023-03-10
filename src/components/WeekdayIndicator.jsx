import React from "react";
import Weekday from "../containers/Weekdays";
import { Days } from "../utils/constants";

const WeekdayIndicator = ({weekDay}) => {
    let finalWeekDays = [];
    for(let k=0; k<=6; k++){
        let j = weekDay;
        let weekDays = [];
        for(let i=0; i<=6; i++){
            if(j > 6) j= 0;
            weekDays.push(Days[j]);
            j++;
        }
        weekDay++;
        if(weekDay > 6) weekDay = 0;
        finalWeekDays[k] = weekDays;
    }
    return (
        <div className="weekday-indicators"> 
            {
                finalWeekDays && finalWeekDays.map((week, index) => {
                    
                    return (
                        <div className="weekday-section" key={index}>
                            {
                                week.map((day, index) => {
                                    return ( <Weekday day={day} key={index} /> )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
        
    );
}

export default WeekdayIndicator;