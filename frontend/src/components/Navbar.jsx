import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style/navbar.css'


function Navbar() {
  const [darkMode, setDarkMode] = useState(false); 
  const [login, setLogin] = useState(localStorage.getItem("login"));
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("login");
    setLogin(null);
    setTimeout(() => {
    navigate("/login");
    }, 0);
  };
  useEffect(()=>{
 const handleStorage = ()=>{
  setLogin(localStorage.getItem("login"))
 }
 window.addEventListener("LocalStorageChange",handleStorage)
 return ()=>{
   window.removeEventListener("LocalStorageChange",handleStorage)
 }
  },[])

  return (
    <nav>
      <div className='Logo' onClick={() => navigate("/")}>To DO App</div>
      <ul className='nav-links'>
        {login && (
          <>
            <li><Link to="/">List</Link></li>
            <li><Link to="/add">Add Task</Link></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        )}
        <li>
          <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar