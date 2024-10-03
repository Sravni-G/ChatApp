import { auth } from "../../../lib/firebase";
import "./more.css";
import { useNavigate } from "react-router-dom";
import { Userstore } from "../../../lib/Userstore";

export default function More() {
  const navigate = useNavigate();
  const { user } = Userstore();

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
    console.log(user);
  };
  return (
    <div className="more">
      <p onClick={handleLogout}>Logout</p>
    </div>
  );
}
