import { toast } from "react-toastify";
import "./login.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Upload from "../../lib/upload";

export default function SignUp() {
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formdata = new FormData(e.target);
    console.log(Object.fromEntries(formdata));
    const { email, username, password, about } = Object.fromEntries(formdata);
    try {
      console.log("Entered try block ");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgurl = await Upload(avatar.file);
      await setDoc(doc(db, "users", res.user.uid), {
        email,
        username,
        id: res.user.uid,
        avatar: imgurl,
        password,
        about,
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success("Account Created Successfully!!!!");
    } catch (err) {
      console.log(err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatar = (e) => {
    console.log(e.target.files);
    console.log(e.target.files.length);

    if (e.target.files.length > 0) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleclick = () => {
    navigate("/signin");
  };

  return (
    <div className="auth">
      <div className="logout">
        <form onSubmit={(e) => handleRegister(e)}>
          <label>
            Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" name="email" />
          </label>
          <label>
            UserName:&nbsp;&nbsp;
            <input type="text" name="username" />
          </label>

          <label>
            Password:&nbsp;&nbsp;
            <input type="password" name="password" />
          </label>
          <label>
            About:&nbsp;&nbsp;
            <input type="text" name="about" />
          </label>

          <label htmlFor="fileinput">
            Upload Avatar
            <input
              type="file"
              id="fileinput"
              onChange={(e) => handleAvatar(e)}
            />
          </label>

          <button disabled={loading}>
            {loading ? "Loading!!!" : "Signup"}
          </button>
          <button onClick={handleclick}>Signin</button>
        </form>
      </div>
    </div>
  );
}
