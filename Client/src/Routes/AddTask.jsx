import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import serverConfig from "../../config/server.config.js";

import "react-datepicker/dist/react-datepicker.css";


function AddTask() {
  useEffect(() => {
    const session = Cookies.get("user");
    if (!session) {
      window.location.href = "/";
    }
  }, []);
  const [startDate, setStartDate] = useState(new Date());
  const [select, setSelect] = useState("");



  async function handleSubmit(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const due = startDate.toISOString();
    const data = { title, description, due, priority: select };
    try {
      const response = await axios.post(`${serverConfig.LOCAL_NET}/api/user/task`, data, { withCredentials: true });
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
      <h2 className="text-2xl font-bold mb-6">New Task</h2>
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
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="priority">
                Priority
              </label>
              <select
                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={select}
                onChange={(e) => setSelect(e.target.value)}
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
                Add Task
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

export default AddTask;
