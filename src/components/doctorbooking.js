import Navbar from "./navbar";
import axios from "axios";
import { useParams,useNavigate} from "react-router-dom";
import React,{useEffect, useState} from "react";
import checkAuth from "./auth/checkAuth";
import {useSelector} from "react-redux";
import "../static/css/DoctorBooking.css"

function Doctorbooking(){
    const {id} = useParams();
    const[date,setDate]=useState();
    const[time,setTime]=useState();
    const[doctor,setDoctor]=useState([]);
    const[error,setError]=useState();
    const [slots, setSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const navigate = useNavigate();
    let user = useSelector(store => store.auth.user)

    const handleBook = (e) => {
  e.preventDefault();

  if (!date || !selectedTime) {
    setError("Please select date and time slot");
    return;
  }

  const bookingData = {
    doctor: id,
    date: date,
    time: selectedTime,
  };

  axios
    .post(
      "https://hospital-appointment-booking-app-backend.onrender.com/appointmentbooking/",
      bookingData,
      { headers: { Authorization: `Token ${user.token}` } }
    )
    .then(() => {
      setError("");
      alert("Successfully Booked!");
      navigate("/doctorlistingpage");
    })
    .catch((error) => {
      console.log(error.response?.data);
      setError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Booking failed"
      );
    });
};

    const fetchSlots = (selectedDate) => {
  axios
    .get(`https://hospital-appointment-booking-app-backend.onrender.com/doctor/${id}/slots/?date=${selectedDate}`)
    .then((res) => {
      setSlots(res.data.slots);
    })
    .catch(() => {

      setSlots([]);
    });
};

const fetchDoctor = async () => {
    try {
      const res = await axios.get(`https://hospital-appointment-booking-app-backend.onrender.com/doctordetail/${id}`, {
        headers: {
          Authorization: `Token ${user.token}`,
        }
      });

      setDoctor(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);



   return (
    <div>
        
    
    <div className="booking-page">
      <Navbar />

 <div className="booking-content">
      <section className="booking-card glass">
        {/* HEADER */}
        <div className="booking-header">
          <h2>Confirm Appointment</h2>
          <p>Please review the details and select a suitable time slot.</p>
        </div>

        {/* DOCTOR INFO */}
        <div className="doctor-summary glass">
          <div>
            <h3>{doctor.name}</h3>
            <span>{doctor.department}</span>
          </div>
          <div className="doctor-note">
            <p>✔ Experienced Consultant</p>
            <p>✔ Hospital Verified</p>
          </div>
        </div>

        {/* FORM */}
        <div className="booking-form">
          {error && <p className="error-text">{error}</p>}

          <div className="form-row">
            <div className="form-group">
              <label>Appointment Date</label>
              <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    fetchSlots(e.target.value); //  important
                  }}
                />
            </div>

            <div className="form-group">
              <label>Preferred Time</label>
              <div className="slots-container">
  {slots.length === 0 ? (
    <p>No slots available</p>
  ) : (
    slots.map((slot) => (
      <button
        key={slot}
        className={`slot-btn ${
          selectedTime === slot ? "active-slot" : ""
        }`}
        onClick={() => setSelectedTime(slot)}
      >
        {slot}
      </button>
    ))
  )}
</div>
            </div>
          </div>

          <div className="booking-info">
            <p>
              ⏱ Please arrive at least <b>10 minutes early</b> for registration.
            </p>
            <p>
              📄 Carry previous reports if this is a follow-up consultation.
            </p>
          </div>

          <button className="btn-primary booking-btn" onClick={handleBook}>
            Confirm Appointment
          </button>
        </div>
      </section>
      </div>
    </div>
    </div>
  );
}
export default checkAuth(Doctorbooking);