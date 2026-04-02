import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/css/ServerWakeup.css";
import axios from "axios";
import checkGuest from "./auth/checkGuest";
function ServerWakeup() {
  const [status, setStatus] = useState("loading"); 
  // loading | success | error
  const navigate = useNavigate();

   useEffect(() => {
    const wakeServer = async () => {
      try {
        const start = Date.now();

        const res = await axios.get("https://hospital-appointment-booking-app-backend.onrender.com/health_check/");

        const duration = Date.now() - start;
        console.log("Response time:", duration, "ms");

        if (res.status === 200 && res.data.status === "ok") {
          setStatus("success");

          setTimeout(() => {
            navigate("/landing");
          }, 1000);
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Wakeup failed:", err.message);
        setStatus("error");
      }
    };

    wakeServer();
  }, [navigate]);


    return (
  <div className="page-bg">
    <div className="loader-card glass">
      {status === "loading" && (
        <>
          <div className="loader"></div>
          <h2>Preparing your experience</h2>
          <p>Connecting securely to hospital services...</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="success">✓</div>
          <h2>All systems ready</h2>
          <p>Redirecting you now...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="error">✕</div>
          <h2>Unable to connect</h2>
          <p>Please check your connection or try again</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </>
      )}
    </div>
  </div>
);
}

export default checkGuest(ServerWakeup);