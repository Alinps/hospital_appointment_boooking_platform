import Navbar from "./navbar"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import React,{useState,useEffect} from "react"
import '../App.css'
import checkAuth from "./auth/checkAuth"
import {useSelector} from "react-redux";
import "../static/css/DoctorListing.css";
import SkeletonList from "./SkeletonList"
function DoctorListingPage(){
  
    const [data,setData] = useState([]);
    const [searchInput,setSearchInput]=useState("");
    const [debouncedSearch,setDebouncedSearch]=useState(""); //state for timed api call
    const [currentPage,setCurrentPage]=useState(1);
    const [totalPages,setTotalPages]=useState(1);
    const [loading,setLoading]=useState(false)
    const [error,setError] = useState(null);
    const [department,setDepartment]=useState("");
    const [departments,setDepartments]=useState([]);

    let user = useSelector(store => store.auth.user)
    console.log(user)
    const navigate=useNavigate();
   useEffect(() => {
  if (!user?.token) return; // wait until Redux is ready
  setLoading(true);

  axios.get("https://hospital-appointment-booking-app-backend.onrender.com/doctorlist/", {
    headers: {
      Authorization: `Token ${user.token}`,
    },
    params: {
      search: debouncedSearch || undefined,
      department: department || undefined,
      page:currentPage,
    },
  })
  .then((response) => {
    setData(response.data.results);
    setError(null)

    setTotalPages(Math.ceil(response.data.count/10));

    const uniqueDepartments = [
      ...new Set(response.data.results.map(item => item.department))
    ];
    setDepartments(uniqueDepartments);
    setLoading(false);
  })
  .catch((err) => {
    setError(err.response?.data?.detail || "An error occurred");
    setLoading(false);
  });
}, [user?.token, department,currentPage,debouncedSearch]);

useEffect(()=>{  
  setCurrentPage(1);
},[department,debouncedSearch]);

useEffect(()=>{   //for delaying the api call for searching
  const timer=setTimeout(()=>{
    setDebouncedSearch(searchInput);
  },400) //adjust delay here

  return ()=>clearTimeout(timer);
},[searchInput])

   return (
  <div className="doctor-page">
    <Navbar />

    {/* PAGE HEADER */}
    <section className="doctor-hero glass">
      <h1>Find the Right Doctor</h1>
      <p>
        Browse specialists across departments and book appointments instantly
        with trusted healthcare professionals.
      </p>
    </section>

    {/* FILTER BAR */}
    <section className="doctor-controls glass">
      <div className="filter-left">
        <h4>Departments</h4>
        <div className="dropdown">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            data-toggle="dropdown"
          >
            {department || "All Departments"}
          </button>

          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => setDepartment("")}
            >
              All Departments
            </button>

            {departments.map((dept, index) => (
              <button
                key={index}
                className="dropdown-item"
                onClick={() => setDepartment(dept)}
              >
                {dept}
              </button>
            ))}

          </div>
        </div>
      </div>

      <div className="search-center">
        <input type="text" onChange={(e)=>setSearchInput(e.target.value)} value={searchInput} size="50" placeholder="Search doctor by name"/>
      </div>

      <div className="filter-right">
       <span>Page {currentPage} of {totalPages}</span>
      </div>
    </section>

    {/* LISTING */}
    <section className="doctor-list">
      {error && <p className="error-text">{error}</p>}
    

    {error && <p className="error-text">{error}</p>}

{loading ? (
  <SkeletonList count={6} />
) : data.length === 0 ? (
  <div className="empty-state glass">
    <h3>No Doctors Found</h3>
    <p>
      Try selecting a different department or check back later.
    </p>
  </div>
) : (
  <div className="doctor-grid fade-list">
    {data.map((item, index) => (
      <div
        key={item.id}
        className="doctor-card glass fade-card"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <img
          src={item.image}
          alt={item.name}
        />

        <div className="doctor-info">
          <h4>{item.name}</h4>
          <p className="dept">{item.department}</p>
          <p className="exp">{item.experience} years experience</p>

          <button
            className="btn-primary btn-sm"
            onClick={() => navigate(`/doctorbooking/${item.id}`)}
          >
            Book Appointment
          </button>
        </div>
      </div>
    ))}
  </div>
)}



        {/* pagination ui */}
        {totalPages > 1 && (
          <div className="pagination glass">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
             ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        )}


    </section>
  </div>
);
}
export default checkAuth(DoctorListingPage);