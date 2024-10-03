import "./userinfo.css";
import { useState } from "react";
import More from "../more/More";
import { Userstore } from "../../../lib/Userstore";

export default function Userinfo() {
  const [toggleMore, setToggleMore] = useState(false);
  const { user } = Userstore();

  return (
    <div className="user">
      <div className="username">
        <img src={user?.avatar || "./avatar.png"} alt="user-profile-picture" />
        <h1>{user?.username}</h1>
      </div>
      {toggleMore ? <More /> : null}
      <div className="icons">
        <img
          src={`${process.env.PUBLIC_URL}/more.png`}
          alt="more-icon"
          onClick={() => setToggleMore((toggleMore) => !toggleMore)}
        />

        <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="edit-icon" />
        <img src={`${process.env.PUBLIC_URL}/video.png`} alt="video-icon" />
      </div>
    </div>
  );
}
