import Navbar from "./navbar";
import '../App.css'
import axios from "axios"
import React,{useState} from "react";
import checkAuth from "./auth/checkAuth";
import {  useSelector } from "react-redux";

function Changepassword(){
    const[currentPassword,setCurrentPassword]=useState("");
    const[newPassword,setNewPassword]=useState("");
    const[confirmPassword,setConfirmPassword]=useState("");
    const[errormessage,setErrorMessage]=useState("");
    let user = useSelector(store=>store.auth.user);
    const handleChangePassword = ()=>{
        if(currentPassword===newPassword){
            setErrorMessage("Can't be same as Current Pasaword");
        }
        else if(newPassword!==confirmPassword){
            setErrorMessage("Password doesn't match!")
            return
        };
        
        const data = {
            currentPassword,
            newPassword,
            confirmPassword
        };
        axios.post('https://hospital-appointment-booking-app-backend.onrender.com/changepassword/',data,{headers:{Authorization:`Token ${user.token}`}})
        .then((response)=>{
            setErrorMessage("");
            alert("Password Changed Successfully")
        })
        .catch((error)=>{
            if(error.response?.data?.message){
                setErrorMessage(error.response.data.message);
            }
            else{
                setErrorMessage("Failed to connect to API.")
            }
        });
    }
    return(
        <div>
            <Navbar/>
            <div className="container-fluid bg-doctordetail">
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="card w-50 blur-card">
                        <div className="card-body">
                            {errormessage && <p style={{color: "red"}}>Error: {errormessage}</p>}
                            <h2 className="card-title">Change Password</h2>
                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <input type="password" value={currentPassword} onChange={(e)=>{setCurrentPassword(e.target.value)}} className="form-control blur-card"/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input type="password" value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}}className="form-control blur-card"/>
                            </div>
                             <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" className="form-control blur-card" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                            </div>
                            <button type="submit" className="btn btn-info float-right" onClick={handleChangePassword}>Confirm Password</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default checkAuth(Changepassword);