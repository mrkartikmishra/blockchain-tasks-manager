const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("TaskManager Contract", () => {
    let TaskManagerContract;
    let taskManagerContract;
    let owner;

    const TOTAL_TASKS = 5;

    let totalTasks;

    beforeEach(async function () {
        TaskManagerContract = await ethers.getContractFactory("TaskManagerContract");
        [owner] = await ethers.getSigners();
        taskManagerContract = await TaskManagerContract.deploy();

        totalTasks = [];

        for (let index = 0; index < TOTAL_TASKS; index++) {
            let task = {
                taskText: "task" + index
            }
            await taskManagerContract.addTask(task.taskText);
            totalTasks.push(task);
        }
    });

    describe("Add Task", () => {
        it("Should emit AddTask event", async () => {
            let task = {
                tasktext: "Test Task"
            }
            await expect(await taskManagerContract.addTask(task.tasktext)).to.emit(taskManagerContract, "AddTask").withArgs(owner.address, task.tasktext, TOTAL_TASKS);
        });
    });

    describe("Fetch All Tasks", () => {
        it("Should return all the tasks", async () => {
            const tasksFromContract = await taskManagerContract.fetchMyTasks();
            await expect(tasksFromContract.length).to.equal(TOTAL_TASKS);
        });
    });

    describe("Delete Task", () => {
        it("Should delete task", async () => {
            await expect(await taskManagerContract.deleteTask(0, true)).to.emit(taskManagerContract, "DeleteTask").withArgs(0, true);
        });
    });
});