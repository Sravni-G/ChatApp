import Userinfo from "./userinfo/Userinfo";
import Chatlist from "./chatlist/Chatlist";
import "./userlist.css";

const Userlist = () => {
  return (
    <div className="list">
      <Userinfo />
      <Chatlist />
    </div>
  );
};
export default Userlist;
