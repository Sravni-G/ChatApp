import "./home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action === "signup") {
      navigate("/signup");
    } else if (action === "signin") {
      navigate("/signin");
    }
  };

  return (
    <div className="home">
      <div className="text">
        <p>Welcome to Chat App</p>
        <span>Take your Friendship to the next Level</span>
      </div>
      <div className="nav">
        <button onClick={() => handleClick("signup")}>SIGNUP</button>
        <button onClick={() => handleClick("signin")}>SIGNIN</button>
      </div>
    </div>
  );
}
