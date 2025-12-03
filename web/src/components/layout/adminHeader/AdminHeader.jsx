import { Link } from "react-router-dom";
import { Settings, Bell, LogOut, User } from "lucide-react"; // تأكد من استيراد الأيقونات المناسبة
import defaultProfileImage from "../../../assets/logosyr3@3x.png";
import "./AdminHeader.css";

const AdminHeader = () => {
  const profileImage = defaultProfileImage;

  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav">
          <Link to="/logout" title="تسجيل الخروج">
            <LogOut className="icon" />
          </Link>
          <Link to="/profile" title="البروفايل">
            <User className="icon" />
          </Link>
          <Link to="/notifications" title="الإشعارات">
            <Bell className="icon" />
          </Link>
        </nav>
        <div className="search-bar">
          <input type="text" placeholder="بحث..." className="search-input" />
        </div>
        <div className="right-side">
          <span className="profile-text">بوابة المشرف العام</span>
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