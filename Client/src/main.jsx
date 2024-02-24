import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './Components/Layout';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import Signup from './Routes/Signup';
import Login from './Routes/Login';
import Dashboard from './Routes/Dashboard';
import AddTask from './Routes/AddTask';
import EditTask from './Routes/EditTask';
import Settings from './Routes/Settings';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddTask />} />
          <Route path="/edit/:id" element={<EditTask />} />
          <Route path="/settings/:id" element={<Settings />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>,
)
