import React from "react";
import './TaskList.scss';
import EdiText from 'react-editext';

const TaskList = ({task, onSave, deleteTask}) => {
    return (
        <div className="tasks-section">
            <div className="task">-</div>
            <div className="task task-state">
                <EdiText 
                    type='text'
                    value={task.st_task}
                    onSave={onSave}
                    inputProps={task.in_id}
                />
            </div>
            <div className="task task-action"><button className="delete_btn" onClick={() => deleteTask(task.in_id)}>x</button></div>
        </div>
    )
}

export default TaskList;