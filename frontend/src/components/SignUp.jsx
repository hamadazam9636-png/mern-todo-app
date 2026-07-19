import { useState, useEffect } from "react"
import "../style/signup.css"
import { Link, useNavigate } from "react-router-dom"
import { usePopup } from "./PopupContext"

function SignUp() {
  const [userData, setUserData] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { showPopup } = usePopup();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!userData.name || !userData.email || !userData.password) {
      showPopup("Warning", "In Correct Data, Please Fill ALL The Fields", "info");
      return;
    }

    setLoading(true)

    try {
      let result = await fetch('/signup', {
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
        showPopup("Error", result.message || "Something went wrong during sign up", "info");
      }
    } catch (error) {
      console.error("SignUp Error:", error);
      showPopup("Error", "Server is not responding. Try again later.", "info");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page-wrapper">
      <div className="signup-card">
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-subtitle">Get started with your todo application</p>
        
        <form onSubmit={handleSubmit} className="signup-form" autoComplete="off">
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input 
              id="name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })} 
              type="text" 
              name="name" 
              placeholder="Enter your name" 
              disabled={loading}
              autoComplete="off"
            />
          </div>

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
              placeholder="Create a strong password" 
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="signup-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          
          <div className="form-footer">
            Already have an account? <Link to="/login" className="form-link">Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp