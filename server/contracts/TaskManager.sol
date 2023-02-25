// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract TaskManager {
    event AddTask(address recipient, string taskText, uint256 taskId);
    event DeleteTask(uint256 taskId, bool isDeleted);

    struct Task {
        uint256 taskId;
        string taskText;
        bool isDeleted;
    }

    Task[] private tasks;

    mapping(uint256 => address) taskToOwner;

    function addTask(string memory taskText) external {
        uint256 taskId = tasks.length;
        tasks.push(Task(taskId, taskText, false));
        taskToOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskText, taskId);
    }

    function fetchMyTasks() external view returns (Task[] memory) {
        Task[] memory tempTasks = new Task[](tasks.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                tempTasks[counter] = tasks[i];
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);

        for (uint256 i = 0; i < counter; i++) {
            result[i] = tempTasks[i];
        }

        return result;
    }

    function deleteTask(uint256 taskId, bool isDeleted) external {
        require(
            taskToOwner[taskId] == msg.sender,
            "Only task owner can delete task"
        );
        tasks[taskId].isDeleted = isDeleted;
        emit DeleteTask(taskId, isDeleted);
    }
}
