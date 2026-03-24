import Navbar from "./navbar";
import axios from"axios"
import React,{useState,useEffect} from "react";
import '../App.css'
import checkAuth from "./auth/checkAuth";
import {useSelector} from "react-redux";
import "../static/css/Appointment.css";
import EditAppointmentModal from "./EditAppointmentModal";


function Myappointment(){
    const[data,setData] = useState([]);
    const[error,setError] = useState();
    const[isModalOpen,setIsModalOpen]=useState(false);
    const[selectedAppointment,setSelectedAppointment]=useState(null);
    const[view,setView]=useState("upcoming"); //"upcoming" | "past"
    let user = useSelector(store => store.auth.user)

        const isPastAppointment = (dateStr)=>{
        const today = new Date();
        today.setHours(0,0,0,0);
        const appointmentDate = new Date(dateStr);
        return appointmentDate < today; 
    }

    const formatTime = (timeStr) =>
        new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-us',{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    
    const formatDate = (dateStr) =>(
        new Date(dateStr).toLocaleDateString('en-us',{
            year:'numeric',
            month:'long',
            day:'numeric'
        }));

    const filteredAppointments = data.filter(item => {
        return view ==="past" 
        ? isPastAppointment(item.date)
        : !isPastAppointment(item.date);
    });

    const openEditModal=(appointment)=>{
      setSelectedAppointment(appointment);
      setIsModalOpen(true);
    };

    const closeModal=()=>{
      setIsModalOpen(false);
      setSelectedAppointment(null);
    };

    const updateAppointmentInUI=(updated)=>{
      setData((prev)=>
      prev.map((appt)=>
      appt.id===updated.id? updated : appt))
    }

    useEffect(()=>{
        
        if(!user){
            console.warn("No token found in localStorage.");
            setError("User not authenticated. Please log in.");
            return;
        }
        axios.get("https://hospital-appointment-booking-app-backend.onrender.com/myappointments/",{headers:{Authorization:`Token ${user.token}`}})
        .then((response)=>{
            setData(response.data);
        })
        .catch((err)=>{
            setError(err.response?.data?.detail || "An error occurred")
        });
    },[user]);

    const handleCancelAppointment = (id)=>{
        axios.delete(`https://hospital-appointment-booking-app-backend.onrender.com/cancelappointment/${id}/`,{headers:{Authorization:`Token ${user.token}`}})
        .then(()=>{
            alert('Appoinment cancelled');
            setData(prev => prev.filter(item =>item.id !== id));
        })
        .catch(err =>{
            alert('Cancel failed');
            console.error(err);
        });
    }
 return (
    <div className="appointments-page">
      <Navbar />

      {/* HEADER */}
      <section className="appointments-hero glass">
        <h1>My Appointments</h1>
        <p>
          View and manage your upcoming and past hospital appointments in one
          place.
        </p>
      </section>

      {/* TOGGLE */}
      <section className="appointments-toggle glass">
        <button
          className={view === "upcoming" ? "active" : ""}
          onClick={() => setView("upcoming")}
        >
          Upcoming
        </button>

        <button
          className={view === "past" ? "active" : ""}
          onClick={() => setView("past")}
        >
          Past
        </button>
      </section>

      {/* LIST */}
      <section className="appointments-list">
        {error && <p className="error-text">{error}</p>}

        {filteredAppointments.length === 0 && (
          <div className="empty-state glass">
            <h3>No Appointments</h3>
            <p>
              {view === "upcoming"
                ? "You have no upcoming appointments."
                : "You have no past appointments."}
            </p>
          </div>
        )}

        {filteredAppointments.map((item) => (
          <div key={item.id} className="appointment-card glass">
            <div className="appointment-left">
              <h4>{item.doctor_name}</h4>
              <span className="dept">{item.department}</span>
            </div>

            <div className="appointment-middle">
              <div>
                <label>Date</label>
                <p>{formatDate(item.date)}</p>
              </div>
              <div>
                <label>Time</label>
                <p>{formatTime(item.time)}</p>
              </div>
            </div>

            <div className="appointment-right">
              {!isPastAppointment(item.date) ? (
                <>
                <button 
                  className="btn-primarys mr-2"
                  onClick={()=>openEditModal(item)}
                  >
                    Edit
                  </button>
         
                <button
                  className="btn-danger"
                  onClick={() => handleCancelAppointment(item.id)}
                >
                  Cancel
                </button>
                </>
              ) : (
                <span className="status past">Completed</span>
              )}
            </div>
          </div>
        ))}
      </section>


        {isModalOpen && selectedAppointment && (
          <EditAppointmentModal
            appointment={selectedAppointment}
            onClose={closeModal}
            onSuccess={updateAppointmentInUI}
            
            />
        )}

    </div>
  );
       
}
export default checkAuth(Myappointment);