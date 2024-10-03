import "./App.css";
import Userlist from "./components/userList/Userlist.js";
import Home from "./components/Home/Home.js";
import Chat from "./components/Chat/Chat.js";
import Login from "./components/Auth/SignIn.js";
import Notification from "./components/Auth/Notification.js";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase.js";
import { Userstore } from "./lib/Userstore.js";
import { Chatstore } from "./lib/Chatstore.js";
import SignIn from "./components/Auth/SignIn.js";
import SignUp from "./components/Auth/SignUp.js";
function App() {
  const { fetchUserInfo } = Userstore();
  const { chatId } = Chatstore();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unsub();
    };
  }, [fetchUserInfo]);
  return (
    <Router>
      <Notification />
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <Home />
            </div>
          }
        ></Route>
        <Route
          path="/Signin"
          element={
            <div className="container">
              <SignIn />
              <Notification />
            </div>
          }
        ></Route>
        <Route
          path="/Signup"
          element={
            <div className="container">
              <SignUp />
              <Notification />
            </div>
          }
        ></Route>
        <Route
          path="/chats"
          element={
            <div className="container">
              <Userlist />
              {chatId ? <Chat /> : null}
            </div>
          }
        ></Route>
        <Route path="/logout" element={<Login />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
