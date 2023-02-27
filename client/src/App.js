import React, { useState, useEffect } from 'react';

import { GOERLI_NETWORK_CHAIN_ID, TASK_MANAGER_CONTRACT_ADDRESS } from './config';
import TaskManagerAbi from './utils/TaskManagerContract.json';
import { ethers } from 'ethers';
import './App.css';

import Task from './components/Task';
import Header from './components/Header';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [correctNetwork, setCorrectetwork] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not Detected!!");
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });

      if (chainId !== GOERLI_NETWORK_CHAIN_ID) {
        console.log("Please select Goerli Testnet to proceed further!!");
        return;
      } else {
        setCorrectetwork(true);
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAddress(accounts[0]);

    } catch (error) {
      console.log("ERROR:: ", error);
    }
  }

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const TaskManagerContract = new ethers.Contract(TASK_MANAGER_CONTRACT_ADDRESS, TaskManagerAbi.abi, signer);
      const myTasks = await TaskManagerContract.fetchMyTasks();
      setTasks(myTasks);
    }
  }

  const addTask = () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskManagerContract = new ethers.Contract(TASK_MANAGER_CONTRACT_ADDRESS, TaskManagerAbi.abi, signer);
        TaskManagerContract.addTask(taskInput)
          .then(() => {
            console.log("Task added successfully!!");
            setTaskInput('');
          })
          .catch((error) => console.log("ERROR:: ", error));
      }
    } catch (error) {
      console.log("ERROR in addTask:: ".error);
    }
  }

  const deleteTask = (taskId) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskManagerContract = new ethers.Contract(TASK_MANAGER_CONTRACT_ADDRESS, TaskManagerAbi.abi, signer);
        TaskManagerContract.deleteTask(taskId, true)
          .then(() => {
            console.log("Task deleted successfully!!");
            fetchMyTasks();
          })
          .catch((error) => console.log("ERROR:: ", error));
      }
    } catch (error) {
      console.log("ERROR in deleteTask:: ", error);
    }
  }
console.log("currentAddress==>>", currentAddress)
  return (
    <div className="App">
      <header className="App-header">
        <Header connectWallet={connectWallet} currentAddress={currentAddress} />
      </header>
      {currentAddress === '' ? (
        <div className="not_connected_section">
          <h1>Please connect your <span className="metamask_text">Metamask</span> wallet</h1>
          <p>Please connect your wallet to manage your tasks!!</p>
          <div className="header__right">
            <button className="connect_wallet_btn" onClick={connectWallet}>Connect Wallet</button>
          </div>
        </div>
      ) : (
        correctNetwork ? (
          <>
            <div className="add_task">
              <input type="text" className="task_input" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
              <button onClick={addTask} className="add_task_btn">ADD TASK</button>
            </div>
            <div className='taskList'>
              {tasks.map((task) => {
                return <Task taskId={task.taskId} taskText={task.taskText} deleteHandler={deleteTask} />
              })}
            </div>
          </>
        ) : (
          <div className="not_connected_section">
            <h1>Please connect <span className="goerli_text">Goerli</span> Network</h1>
            <p>Please connect Goerli Network to manage your tasks!!</p>
            <div className="header__right">
              <button className="connect_wallet_btn" onClick={connectWallet}>Connect Wallet</button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default App;
