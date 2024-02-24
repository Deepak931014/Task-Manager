import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import serverConfig from "../../config/server.config.js";

import "react-datepicker/dist/react-datepicker.css";


function EditTask() {

  useEffect(() => {
    const session = Cookies.get("user");
    if (!session) {
      toast.error("You're not logged in!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "light",
      });
      window.location.href = "/";
    }
  }, []);

  const [due, setDue] = useState(null);
  const [priority, setPriority] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${serverConfig.LOCAL_NET}/api/user/task/${id}`, { withCredentials: true });
        const { task } = response.data;
        setDue(new Date(task.due));
        setTitle(task.title);
        setPriority(task.priority);
        setDescription(task.description);
      } catch (error) {
        console.log(error.response.data);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { title, description, due: due.toISOString(), priority };
    try {
      const response = await axios.put(`${serverConfig.LOCAL_NET}/api/user/task/update/${id}`, data, { withCredentials: true });
      const { message } = response.data;

      toast.success(message, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "light",
      });
      window.location.href = "/";
    } catch (error) {
      if (error.response) return console.log(error.response.data);
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-[100px] mx-4 lg:py-[80px]">
      <h2 className="text-2xl font-bold mb-6">Edit Task</h2>
      <div className="w-full max-w-md">
        <div className="bg-white p-8 border-[1px] rounded-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
                Task Title
              </label>
              <input
                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="E.g Read a book"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                Task Description
              </label>
              <input
                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of the task"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="due">
                Due Date
              </label>
              <DatePicker
                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                showTimeSelect
                id="due"
                selected={due}
                onChange={(date) => setDue(date)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="priority">
                Priority
              </label>
              <select
                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Edit Task
              </button>
              <Link
                className="inline-block align-baseline font-bold text-sm text-slate-600 hover:text-slate-400"
                to="/"
              >
                &#8592; Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
