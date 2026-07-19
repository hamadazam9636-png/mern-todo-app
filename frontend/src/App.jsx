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
function App() {


  return (
    <>
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
