import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskItem from '../Components/TaskItem';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import serverConfig from "../../config/server.config.js";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const session = Cookies.get("user");
    if (!session) {
      window.location.href = "/";
    }
  }, []);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${serverConfig.LOCAL_NET}/api/user/task`, { withCredentials: true });
        const { tasks } = response.data;
        setTasks(tasks);
      } catch (error) {
        console.log(error.response);
        toast.error(error.response.data['error'], {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: "light",
        });
      }
    }
    fetchTasks();
  }, [tasks]);

  useEffect(() => {
    const activeTasks = tasks.filter(task => task.completed === false);
    setActiveTasks(activeTasks);
  }, [tasks]);

  useEffect(() => {
    const completedTasks = tasks.filter(task => task.completed === true);
    setCompletedTasks(completedTasks);
  }, [tasks]);



  return (
    <div className='container px-[40px] py-[40px] lg:py-[60px] lg:px-[300px]'>
      <div>
        <div>
          <h1 className='text-2xl font-bold mx-2'>Active Tasks</h1>
        </div>
        <div className="flex flex-col justify-center mt-[20px] gap-3">
          {!tasks.length ? (
            <h1 className="text-center text-2xl font-bold my-[40px]">No Tasks</h1>
          ) :
            !activeTasks.length ? (
              <h1 className="text-center text-2xl font-bold my-[40px]">No Active Tasks</h1>
            ) : activeTasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))
          }
        </div>
      </div>

      <div>
        <h1 className='text-start text-2xl font-bold my-5'> Completed Tasks</h1>
        <div className="flex flex-col justify-center mt-[20px] gap-3">
          {!tasks.length ? (
            <h1 className="text-center text-2xl font-bold my-[20px]">No Tasks</h1>
          ) : !completedTasks.length ? (
            <h1 className="text-center text-2xl font-bold my-[20px]">No Completed Tasks</h1>
          ) : completedTasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard;