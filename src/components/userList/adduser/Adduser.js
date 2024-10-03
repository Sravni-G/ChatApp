import {
  query,
  collection,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../../lib/firebase";

import "./adduser.css";
import { useState } from "react";
import { Userstore } from "../../../lib/Userstore";
import { calculateDocumentSize } from "../../../lib/calculateDocumentSize";
import Notification from "../../Auth/Notification";

export default function Adduser() {
  const [useradded, setUseradded] = useState(null);
  const { user } = Userstore();
  const [userExist, setUserExist] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Entered Search");
    const formdata = new FormData(e.target);
    console.log("formdata", formdata);
    const username = formdata.get("username");
    console.log("username", username);
    try {
      const docRef = collection(db, "users");
      const res = query(docRef, where("username", "==", username));
      console.log("query res", res);

      const querysnapshot = await getDocs(res);
      console.log("query snapshot", querysnapshot);
      if (querysnapshot) {
        const founduser = querysnapshot.docs[0].data();
        setUseradded(founduser);

        checkExisting(founduser);
      }
    } catch (err) {
      console.log(err);
    }
    console.log("useradded", useradded);
  };

  const checkExisting = async (useradded) => {
    const userchats = await getDoc(doc(db, "userchats", user.id));
    const chats = userchats.data()?.chats || [];
    if (chats.length > 0) {
      var res = chats.some((chat) => chat.receiverid == useradded?.id);
    }
    setUserExist(res);
    if (res) {
      toast("User exist in chats!! Please search");
    }
  };

  const handleAdd = async (founduser) => {
    console.log("add function");
    if (founduser.id == user.id) {
      return;
    }
    try {
      const sizeInBytes = await calculateDocumentSize("userchats", user.id);

      // Firestore limit for a document is 1 MB, which is ~1,048,576 bytes
      if (sizeInBytes > 1000000) {
        alert("Document size exceeds the limit. Cannot add more users.");
        return; // Stop execution if size exceeds the limit
      }
      const chatRef = collection(db, "chats");
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
      console.log(newChatRef.id);
      await updateDoc(doc(db, "userchats", founduser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          receiverid: user.id,
          lastmessage: "",
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(db, "userchats", user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          receiverid: founduser.id,
          lastmessage: "",
          updatedAt: Date.now(),
        }),
      });
      toast.success("User added successfully");
      setUserExist(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="adduser">
      <form
        onSubmit={(e) => {
          console.log("search button clicked");
          handleSearch(e);
        }}
      >
        <input type="text" placeholder="Add user" name="username" />
        <button>Search</button>
      </form>
      {useradded ? (
        <div className="user">
          <div className="detail">
            <img src={useradded.avatar} />
            <span>{useradded.username}</span>
          </div>
          {/* <button onClick={() => handleAdd(useradded)}>Adduser</button> */}
          <button
            disabled={userExist}
            onClick={() => {
              console.log("Button clicked");
              handleAdd(useradded);
            }}
          >
            {userExist ? "Added" : "Adduser"}
          </button>
        </div>
      ) : null}
      <Notification />
    </div>
  );
}
