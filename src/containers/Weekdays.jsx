import React from "react";

const Weekday = ({day}) => {
    let hightlight = (day === 'Sun')? 'hightlightDay':'';
       
    return (
        <div className={`weekday-indicator-icon ${hightlight}`} >{day}</div>
    )
}

export default Weekday;