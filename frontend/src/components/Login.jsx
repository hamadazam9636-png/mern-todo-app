import { useEffect, useState } from "react"
import "../style/signup.css"
import { Link, useNavigate } from "react-router-dom"
import { usePopup } from "../components/PopupContext";

function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const { showPopup } = usePopup();
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!userData.email || !userData.password) {
      showPopup("Warning", "Please fill all fields", "info");
      return;
    }

    setLoading(true)
    
    try {
      let result = await fetch('/login', {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "Application/Json"
        }
      })
      
      result = await result.json()
      
      if (result.success) {
        document.cookie = "token=" + result.token + "; path=/; max-age=86400";
        localStorage.setItem("login", userData.email);
        window.dispatchEvent(new Event('LocalStorageChange'))
        navigate("/");
      } else {
        showPopup("Error", result.message || "Invalid Email or Password", "info");
      }
    } catch (error) {
      console.error("Login Error:", error);
      showPopup("Error", "Server is not responding. Try again later.", "info");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page-wrapper">
      <div className="signup-card">
        <h1 className="signup-title">Welcome Back</h1>
        <p className="signup-subtitle">Login to manage your tasks</p>
        
        <form onSubmit={handleSubmit} className="signup-form" autoComplete="off">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              type="email" 
              name="email" 
              placeholder="name@example.com" 
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="signup-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          
          <div className="form-footer">
            Don't have an account? <Link to="/signup" className="form-link">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login