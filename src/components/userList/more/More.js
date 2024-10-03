import { auth } from "../../../lib/firebase";
import "./more.css";
import { useNavigate } from "react-router-dom";
import { Userstore } from "../../../lib/Userstore";
import Notification from "../../Auth/Notification";
import { toast } from "react-toastify";

export default function More() {
  const navigate = useNavigate();
  const { user } = Userstore();

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
    toast("Logging out");
    console.log(user);
  };
  return (
    <div className="more">
      <Notification />
      <p onClick={handleLogout}>Logout</p>
    </div>
  );
}
