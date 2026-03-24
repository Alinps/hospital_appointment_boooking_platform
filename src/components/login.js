import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../store/authSlice";
import checkGuest from "./auth/checkGuest";
import "../static/css/Login.css"
import Navbar from "./navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://hospital-appointment-booking-app-backend.onrender.com/login/", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      //  Backend returns { user: { id, name, email, token } }
      const user = response.data.user;

      if (!user?.token) {
        throw new Error("Token missing in login response");
      }

      //  Update Redux (localStorage handled in slice)
      dispatch(setUser(user));

      alert("Login successful!");

      // ❌ DO NOT navigate here
      // checkGuest will redirect automatically

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setErrorMessage(
        err.response?.data?.detail || err.message || "Login failed"
      );
    }
  };

 return (
<div>
 <Navbar/>
 
   
    <div className="hospital-login-card">

      {/* Hospital Identity */}
      <div className="hospital-brand">
        <h1>CarePlus Hospital</h1>
        <p>
          Secure patient portal for appointments, consultations,
          and medical records.
        </p>
      </div>

      {/* Login Section */}
      <div className="login-section">
        <h2>Patient Login</h2>

        {errorMessage && (
          <p className="login-error">{errorMessage}</p>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Registered email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign in</button>
        </form>

        <div className="login-footer">
          <span>New patient?</span>
          <Link to="/signup">Create an account</Link>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="hospital-trust">
        <p>✔ Secure access to medical records</p>
        <p>✔ Appointment booking with verified doctors</p>
        <p>✔ Data protected as per healthcare standards</p>
      </div>

    </div>

  </div>
);



}

export default checkGuest(Login);
