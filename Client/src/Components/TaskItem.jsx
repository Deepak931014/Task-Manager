import moment from "moment";
import { MdDelete, MdOutlineDoneAll, MdEditNote } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import serverConfig from "../../config/server.config.js";

function TaskItem({ task }) {
  const { title, description, due, priority, completed, _id } = task;

  async function handleDelete() {
    try {
      await axios.delete(`${serverConfig.LOCAL_NET}/api/user/task/delete/${_id}`, { withCredentials: true });
      navigate("/", { replace: true });
    } catch (error) {
      if (error.response) return console.log(error.response.data);
      console.log(error);
    }
  };

  async function handleDone() {
    try {
      await axios.put(`${serverConfig.LOCAL_NET}/api/user/task/update/${_id}`, { completed: true }, { withCredentials: true });
      navigate("/", { replace: true });
    } catch (error) {
      if (error.response) return console.log(error.response.data);
      console.log(error);
    }
  }

  return (
    <div className={`flex flex-col items-center justify-between p-4 max-w-[450px] lg:max-w-none border border-slate-600 rounded-md lg:flex-row lg:gap-5`}>
      <div className="flex flex-col space-y-2">
        <div>
          <h3 className="text-2xl font-semibold">{title}</h3>
        </div>
        <p className="text-base text-left text-gray-600 mt-1">{description}</p>
        <span className="text-base text-gray-600 mr-2">{`${moment(due).format("YYYY-MM-DD, h:mm a")}`}</span>
        <h3 className={`text-base font-bold uppercase text-red-600`}>
            {priority}
          </h3>
      </div>
      <div className="flex flex-row flex-grow gap-3 lg:flex-grow-0">
        <button disabled={completed} className={`${completed === true ? `hidden` : `inline`} bg-blue-600 hover:bg-blue-400 disabled:bg-slate-600 disabled:hover:bg-slate-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>
          <Link to={`/edit/${_id}`} className="flex items-center">
            <MdEditNote className="w-4 h-4 mr-2" />
            <span>Edit</span>
          </Link>
        </button>

        <button className="bg-red-600 hover:bg-red-400 disabled:bg-slate-600 disabled:hover:bg-slate-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center" onClick={handleDelete}>
          <MdDelete className="w-4 h-4 mr-2" />
          <span>Delete</span>
        </button>

        <button disabled={completed} className="bg-green-600 hover:bg-green-400 disabled:bg-slate-600 disabled:hover:bg-slate-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center" onClick={handleDone}>
          <MdOutlineDoneAll className="w-4 h-4 mr-2" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}

export default TaskItem;  