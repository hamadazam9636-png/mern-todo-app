import { useState } from 'react'
import './style/App.css'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import AddTask from './components/AddTask'
import List from './components/List'
import UpdateTask from './components/UpdateTask'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Protected from './components/Protected'
import { PopupProvider } from "./components/PopupContext"
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your network status.");
      return Promise.reject(new Error("No internet connection"));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error" || !navigator.onLine) {
      toast.error("Network connection lost. Please try again.");
    }
    return Promise.reject(error);
  }
);
function App() {


  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <PopupProvider>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Protected><List/></Protected>}/>
      <Route path='/add' element={<Protected><AddTask/></Protected>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/update/:id' element={<UpdateTask/>}/>
    </Routes>
    </PopupProvider>
    </>
  )
}

export default App
