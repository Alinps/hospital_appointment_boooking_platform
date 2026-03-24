import Navbar from "./navbar";
import "../App.css"

function Doctordetails(){
    return(
        <div>
            <Navbar/>
            <div className="container-fluid bg-doctordetail ">
                <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card customCard blur-card w-50">
                            <div className="row no-gutters align-items-center">
                                <div className="col-md-4 p-2">
                                    <img src="https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" className="img-fluid rounded" alt="doctorimage"/>
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h2 className="card-title custom-custom-font-heading" style={{color:"#3c7088"}}>Dr.Bruce Wayn</h2>
                                        <p className="card-text m-0 p-0 custom-font-text" style={{color:"#3c7088"}}>Cardiology</p>
                                        <p className="card-text m-0 p-0 custom-font-text" style={{color:"#3c7088"}}>Phd in cardiology</p>
                                        <button className="btn btn-info btn-block">Book</button>
                                    </div>
                                </div>
                            </div> 
                        </div>
                </div>
                
            </div>
        </div>
    )
}
export default Doctordetails;