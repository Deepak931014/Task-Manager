import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import serverConfig from "../../config/server.config.js";

function Settings() {
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

  const { id } = useParams();

  // states for user input
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${serverConfig.LOCAL_NET}/api/user/${id}`, { withCredentials: true });
        const { user } = response.data;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
      } catch (error) {
        console.log(error.response.data);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { firstName, lastName, email, password };
    try {
      const response = await axios.put(`${serverConfig.LOCAL_NET}/api/user/update/${id}`, data, { withCredentials: true });
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
      console.log(error.response.data);
    }
  }

  async function handleDelete() {
    try {
      await axios.delete(`${serverConfig.LOCAL_NET}/api/user/delete/${id}`, { withCredentials: true });
      Cookies.remove("user");
      window.location.href = "/";
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-[100px] mx-4 lg:py-[80px]">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 border-[1px] rounded-md">
          <h2 className="text-2xl font-bold mb-6">Edit Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                First Name
              </label>
              <input
                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Last Name
              </label>
              <input
                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Update Profile
              </button>
              <button
                className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleDelete}
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
