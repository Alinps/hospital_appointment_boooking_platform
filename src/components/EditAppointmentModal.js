import { useState,useEffect } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import "../static/css/EditModal.css";

function EditAppointmentModal({ appointment, onClose, onSuccess }) {
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState(appointment.time);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slots, setSlots] = useState([]);
const [selectedTime, setSelectedTime] = useState(appointment.time);
  let user = useSelector(store => store.auth.user)

const handleSave = async () => {
  setLoading(true);
  setError("");

  try {
    await axios.put(
      `https://hospital-appointment-booking-app-backend.onrender.com/appointments/${appointment.id}/reschedule/`,
      { date, time: selectedTime },
      {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      }
    );

    onSuccess({
      ...appointment,
      date,
      time: selectedTime,
    });

    onClose();
  } catch (err) {
    setError(
      err.response?.data?.non_field_errors?.[0] ||
      err.response?.data?.error ||
      "Unable to reschedule appointment"
    );
  } finally {
    setLoading(false);
  }
};


  const fetchSlots = async (selectedDate) => {
  try {
    const res = await axios.get(
      `https://hospital-appointment-booking-app-backend.onrender.com/doctor/${appointment.doctor}/slots/?date=${selectedDate}`,
      {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      }
    );

    setSlots(res.data.slots);
  } catch (error) {
    console.log(error);
    setSlots([]);
  }
};

useEffect(() => {
  fetchSlots(date);
}, []);

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="edit-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Edit Appointment</h3>

        <label>
          Date
          <input
  type="date"
  value={date}
  min={new Date().toISOString().split("T")[0]}
  onChange={(e) => {
    setDate(e.target.value);
    fetchSlots(e.target.value); 
  }}
/>
        </label>

        <label>
          Time
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
        </label>

        {error && <p className="error-text">{error}</p>}

        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default EditAppointmentModal;
