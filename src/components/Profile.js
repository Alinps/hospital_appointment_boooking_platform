    import {  useEffect, useState } from "react";
    import axios from "axios";
    import { useSelector } from "react-redux";
    import "../static/css/Profile.css"
    import Navbar from "./navbar";
    const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState(null);

        const [error, setError] = useState("");

    let user = useSelector(store => store.auth.user)
    console.log(user);

        useEffect(()=>{
             if (!user?.token) return; // wait until Redux is ready
             setLoading(true);
            axios.get("https://hospital-appointment-booking-app-backend.onrender.com/profile/",{
                headers:{
                    Authorization:`Token ${user.token}`,
                },
            })
            .then((res)=>{
                console.log(res.data)
                setProfile(res.data);
                setFormData(res.data);
                setLoading(false);
            })
            .catch(()=>{
                setError("failed to load profile");
                setLoading(false);
            });
        },[user?.token]);

        const handleChange = (e)=>{
            const {name,value} = e.target;
            setFormData((prev)=>({
                ...prev,
                [name]:value,
            }));
        };
        const handleAvatarChange = (e) => {
  setAvatarFile(e.target.files[0]);
};


        const handleSave = () => {
  const data = new FormData();

  Object.keys(formData).forEach((key) => {
    if (formData[key] !== null) {
      data.append(key, formData[key]);
    }
  });

  if (avatarFile) {
    data.append("avatar", avatarFile);
  }

  axios.put("https://hospital-appointment-booking-app-backend.onrender.com/profile/", data, {
    headers: {
      Authorization: `Token ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  })
  .then((res) => {
    setProfile(res.data);
    setIsEditing(false);
    setAvatarFile(null);
  })
  .catch(() => {
    setError("failed to update profile");
  });
};

    const handleCancel=()=>{
            setFormData(profile);
            setIsEditing(false);
        }





        if (loading) return <p>Loading profile...</p>;
        if (error) return <p style={{color:"red"}}>{error}</p>
    return(
        <div>
              <Navbar/>
       
        <div className="profile-card">
          
            <h2>My Profile</h2>

            <div className="profile-header">
        <img
  src={
    profile.avatar
      ? `${profile.avatar}`
      : "/default-avatar.png"
  }
  alt="avatar"
  className="avatar"
/>


      {isEditing && (
  <input type="file" accept="image/*" onChange={handleAvatarChange} />
)}

</div>
            <div className="field">
                <label>Email</label>
                <p>{profile.email}</p>
            </div>

            <div className="field">
                <label>Full Name</label>
                {isEditing?(
                    <input  
                            name="full_name"
                            value={formData.full_name || ""}
                            onChange={handleChange}/>
                ): (
                    <p>{profile.full_name || "-"}</p>
                )}
            </div>
              <div className="field">
            <label>Address</label>
            {isEditing ? (
                <input 
                type="textarea"
                name="address"
                value={formData.address}
                onChange={handleChange}/>
            ):(
                <p>{profile.address}</p>
            )
            }
        </div>
             <div className="field">
            <label>Contact Number</label>
            {isEditing ? (
                <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}/>
            ):(
                <p>{profile.phone}</p>
            )
            }
        </div>
              <div className="field">
            <label>Date of Birth:</label>
            {isEditing ? (
                <input 
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}/>
            ):(
                <p>{profile.dob}</p>
            )
            }
        </div>

                <div className="field">
                    <label>Gender</label>
                    {isEditing ? (
                        <select
                            name="gender"
                            value={formData.gender || ""}
                            onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                        </select>
                    ):(
                        <p>{profile.gender || "-"}</p>
                    )
                }
                <div className="actions">
            {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
            <>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
            </>
            )}
        </div>  
      
                </div>

        </div>
         </div>
    )
    }
    export default Profile;