import React from 'react';

import './Task.css';

const Task = ({ taskId, taskText, deleteHandler }) => {
    return (
        <div className='task'>
            <p>{taskText}</p>
            <button onClick={() => deleteHandler(taskId)} className="delete_task_btn">DELETE</button>
        </div>
    );
}

export default Task;