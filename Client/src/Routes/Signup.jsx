import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Cookies from "js-cookie";
import serverConfig from "../../config/server.config.js";

function Register() {

  useEffect(() => {
    const session = Cookies.get("user");
    if (session) {
      window.location.href = "/";
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const data = { firstName, lastName, email, password };

    try {
      const response = await axios.post(`${serverConfig.LOCAL_NET}/api/user/register`, data, { withCredentials: true });
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

  return (
    <div className="flex flex-col items-center justify-center py-[100px] mx-4 lg:py-[80px]">
      <h2 className="text-2xl font-bold mb-6">Register and start taskin'</h2>
      <div className="w-full max-w-md">
        <div className="bg-white p-8 border-[1px] rounded-md">
          <h2 className="text-2xl font-bold mb-6">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                First Name
              </label>
              <input
                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                type="text"
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
                placeholder="Password"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-slate-600 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
              <Link
                className="inline-block align-baseline font-bold text-sm text-slate-600 hover:text-slate-400"
                to="/login"
              >
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
