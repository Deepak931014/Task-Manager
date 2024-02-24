import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import axios from "axios";
import { MdAddCircleOutline, MdSettings, MdOutlineLogout } from "react-icons/md";
import serverConfig from "../../config/server.config.js";


function Navbar() {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const user = Cookies.get("user");
        if (user !== undefined) {
            setIsAuthenticated(true);
            const userData = JSON.parse(user)
            setUser(userData);
        }
    }, []);

    function toggleNavbar() {
        setIsNavbarOpen(!isNavbarOpen);
    }

    async function logout() {
        try {
            const response = await axios.get(`${serverConfig.LOCAL_NET}/api/user/logout`, { withCredentials: true });
            const { message } = response.data;
            console.log(message);
            Cookies.remove("user");
            setIsAuthenticated(false);
            window.location.href = "/";
        } catch (error) {
            console.log(error.response.data);
        }
    }


    return (
        <nav className="flex items-center justify-between flex-wrap bg-white p-4 border-b-[1px] border-slate-300">
            <div className="flex items-center flex-shrink-0 text-black mr-6">
                <Link to={`/`}>
                    <span className="font-semibold text-xl tracking-tight">DeepakTask</span>
                </Link>
            </div>
            <div className="block lg:hidden">
                <button
                    className="flex items-center px-3 py-2 border rounded text-black border-black hover:text-slate-500 hover:border-slate-500"
                    onClick={toggleNavbar}
                >
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d="M0 3a3 3 0 0 1 3-3h14a3 3 0 0 1 0 6H3a3 3 0 0 1-3-3zm0 8a3 3 0 0 1 3-3h14a3 3 0 0 1 0 6H3a3 3 0 0 1-3-3z" />
                    </svg>
                </button>
            </div>
            <div className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isNavbarOpen ? "" : "hidden"} transition duration-500 ease-in-out`}>
                <div className="text-sm lg:flex-grow">
                    {isAuthenticated ? (
                        <div className="flex flex-row items-center justify-items-end">
                            <div className="mr-4 font-medium">
                                <h4>Welcome, {user.firstName}!</h4>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                                <Link to={`/add`} className="flex items-center mr-2">
                                    <MdAddCircleOutline className="w-4 h-4 mr-1" />
                                    <span>Add <span className="hidden lg:inline">Task</span></span>
                                </Link>
                            </button>
                            <button className="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                                <Link to={`/settings/${user._id}`} className="flex items-center mr-2">
                                    <MdSettings className="w-4 h-4 mr-1" />
                                    <span>Settings</span>
                                </Link>
                            </button>
                            <button className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center mr-2" onClick={logout}>
                                <MdOutlineLogout className="w-4 h-4 mr-1" />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/register" className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-slate-400 mr-4">
                                Register
                            </Link>
                            <Link to="/login" className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-slate-400 mr-4">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
