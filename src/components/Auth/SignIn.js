import { toast } from "react-toastify";
import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import Notification from "./Notification";

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlelogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formdata = new FormData(e.target);
    const { email, password } = Object.fromEntries(formdata);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => navigate("/chats"), 100);
      toast.success("Logged In");
    } catch (err) {
      toast.error("Wrong Username/Password");
      toast("Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <Notification />
      <div className="login">
        <form onSubmit={handlelogin}>
          <label>
            Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" name="email" />
          </label>

          <label>
            Password:&nbsp;&nbsp;
            <input type="password" name="password" />
          </label>
          <button>{loading ? "Loading!!!" : "SIGNIN"}</button>
        </form>
      </div>
    </div>
  );
}
