import { toast } from "react-toastify";
import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";

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
      toast.success("Logged In");
      navigate("/chats");
    } catch (err) {
      navigate("/login");
      toast.error(err.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
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
          <button>{loading ? "Loading!!!" : "LogIn"}</button>
        </form>
      </div>
    </div>
  );
}
