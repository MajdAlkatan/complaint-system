// import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import defaultProfileImage from "../../../assets/d1d2c7acfb014d9392fef2b96347643e.jpeg";
import "./AdminHeader.css"
const AdminHeader = () => {

  const profileImage = defaultProfileImage;

  return (
    <header className=" header ">
      <div className="header-container">
        <nav className="header-nav">
          <p  >Dashboard</p>
          <p >Complaint</p>
          <p >Reports</p>
        </nav>
        <div className="right-side">
          <p >
            <Settings className="cursor-pointer" />
          </p>
          <img
            src={profileImage}
            alt="Avatar"
            className="img-header"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
