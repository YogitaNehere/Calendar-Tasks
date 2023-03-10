import React, { useState } from "react";
import moment from "moment";
import axios from "axios";
import TaskList from "./Tasks/TaskList";
import { getDayOfMonth, getMonth, getMonthDayYear, getReadableMonthDate, getReadableWeekday, getYear } from "../utils/moment-utils";
import { getDatesInMonthDisplay, getDaysInMonth, getMonthColor } from '../utils/date-utils';
import { API_BASE_URL } from "../utils/constants";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const DateIndicator = ({selectDate, setSelectDate, tasks}) => {
    const [modalInfo, setModalInfo] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const CreateTask = () => {
        const [value, setValue] = useState("");

        const handleSubmit = (e) => {
            e.preventDefault();
            if(!value) return;
            // save data in DB
            let date = moment(selectDate).format('YYYY-MM-DD');
            axios
                .post(API_BASE_URL+`add-task?st_task=${value}&dt_task_date=${date}`)
                .then((response) => {
                    const newTasks = [...modalInfo, response.data];
                    setModalInfo(newTasks);
                    // toggleTrueFalse();
                })
                .catch((error) => {
                    console.log('error');
                });
            setValue("");
        }

        return(
            <>
            <form onSubmit={handleSubmit}>
                <Form.Control
                    type="text"
                    className="input"
                    value={value}
                    placeholder="Add a new task"
                    onChange={e => setValue(e.target.value)}
                />
                <Button variant="success" onClick={handleSubmit}>+ Add</Button>{' '}
            </form>
            </>
        )
    }

    const deleteTask = id => {
        axios
            .post(API_BASE_URL+`delete-task?in_id=${id}`)
            .then((response) => {
                if(response.data.status === 'success'){
                    const newTasks = [...modalInfo];
                    let modifiedTasks = newTasks.filter(function( task ) {
                        return task.in_id !== id;
                    });
                    setModalInfo(modifiedTasks);
                }
            })
            .catch((error) => {
                console.log('from error...');
            });
    };

    const onSave = (taskStr, id) => {
        //Update task in DB also
        axios
            .post(API_BASE_URL+`update-task?in_id=${id}&st_task=${taskStr}`)
            .then((response) => {
                if(response.data.status === 'success'){
                    const newTasks = [...modalInfo];
                    const modifiedTasks = newTasks.map( task  =>  task.in_id === id ? { ...task, st_task: taskStr } : task);
                    setModalInfo(modifiedTasks);
                }
            })
            .catch((error) => {
                console.log('from error...');
            });
     }

    const ModalContent = () => {
        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{getReadableWeekday(selectDate)}, {getReadableMonthDate(selectDate)} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="tasks_container">
                        {
                            modalInfo && modalInfo.map((task, index) => {
                                return (      
                                <TaskList key={index} task={task} onSave={onSave} deleteTask={deleteTask} />
                                )
                            })
                        }
                     </div>
                    <div className="create-task">
                        <CreateTask />
                    </div>
                    
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="outline-dark" onClick={handleClose}>Close</Button>{' '}
                </Modal.Footer> */}
            </Modal></>
        )
    }

    const toggleTrueFalse = () => {
        setShowModal(handleShow);
    }

    const datesInMonth = getDatesInMonthDisplay(
        getMonth(selectDate) + 1,
        getYear(selectDate),
        tasks
    );
    
    const getLastDay = (selectDate) => {
        const totalDays = getDaysInMonth(
            getMonth(selectDate) + 1,
            getYear(selectDate)
        )
        return totalDays;
    }

    const changeDate = (e) => {
        if(e.target.getAttribute('data-active-month') === 'true'){
            const selectedDate = e.target.getAttribute('data-date');
            //Fetch tasks from API and show it in modal
            let date = moment(selectedDate).format('YYYY-MM-DD');
            axios
            .post(API_BASE_URL+'get-task?dt_task_date='+ date)
            .then((response) => {
                setModalInfo(response.data);
                setShow(true);
                toggleTrueFalse();
                
            })
            .catch((error) => {
                console.log('error');
            });

            setSelectDate(selectedDate);
        }
    }

    const totalDays = datesInMonth.length;
    
    let maxDays = totalDays;
    let colLength =5;
    if (maxDays === 28) colLength =4;
    let col = [];
    let inner = [];
    let dayCounter = 1;
    for(let i=0; i< colLength; i++){
        inner = [];
        for(let j = 0; j < 7; j++){
            if(dayCounter <= maxDays ){
                inner[j] = datesInMonth[dayCounter-1];
                dayCounter++;
            }
        }
        col[i] = inner;
    }
     
    return(
        <div className="date-indicator">
            {
                col.map((days, index) => {
                    return (
                        <div className="date-section" key={index}>
                            {
                                days.map((i, key) => {
                                    const selected = getMonthDayYear(selectDate) === getMonthDayYear(i.date) ? 'selected':'';
                                    const taskClass = (i.taskStatus === 1) ? 'show_task':'';
                                
                                    let MonthColor = '';
                                    if(getDayOfMonth(i.date) === getLastDay(selectDate)){
                                        MonthColor = getMonthColor(getLastDay(selectDate));
                                    }
                                    
                                    return (
                                        <div 
                                            className={`date-icon ${selected} ${MonthColor} ${taskClass}` } //"date-icon" 
                                            data-active-month={i.currentMonth}
                                            data-date={i.date.toString()}
                                            key={key}
                                            onClick={changeDate}
                                        >
                                            {getDayOfMonth(i.date)} 
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            {
                show ? <ModalContent /> : null
            }
        </div>
    )   
}
export default DateIndicator;