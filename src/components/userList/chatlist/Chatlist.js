import {
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import Adduser from "../adduser/Adduser";
import "./chatlist.css";
import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { Userstore } from "../../../lib/Userstore";
import { Chatstore } from "../../../lib/Chatstore";

export default function Chatlist() {
  const [toggleAdd, setToggleAdd] = useState(false);
  const [chats, setChats] = useState([]);
  const { user, isLoading } = Userstore();
  const { changeChat } = Chatstore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsub = onSnapshot(doc(db, "userchats", user?.id), async (res) => {
      const items = res.data()?.chats || [];
      console.log(items);

      const promises = items.map(async (item) => {
        const userdocRef = doc(db, "users", item.receiverid);
        const userdoc = await getDoc(userdocRef);
        const user = userdoc.data();
        return { ...item, user };
      });
      const chatdata = await Promise.all(promises);
      setChats(chatdata.sort((a, b) => b.updatedAt - a.updatedAt));
    });
    return () => {
      unsub();
    };
  }, [user?.id]);

  const handleSelect = async (chat) => {
    console.log(
      "clicked on chat",
      chat.chatId,
      chat.isSeen,
      chat.user.id,
      user.id
    );

    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;

    try {
      await updateDoc(doc(db, "userchats", user?.id), {
        chats: userChats,
      });
      changeChat(chat?.chatId, chat?.user);
    } catch (err) {
      console.log(err);
    }
  };
  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(search.toLowerCase())
  );

  console.log("Filtered Chats:", filteredChats);
  console.log("All Chats:", chats);

  return (
    <div className="chatlist">
      <div className="search">
        <div className="search-bar">
          <img src={`${process.env.PUBLIC_URL}/search.png`} alt="search-icon" />
          <input
            type="text"
            placeholder="Search user..."
            onChange={(e) => setSearch(e.target.value)}
            // onKeyDown={(e) => (e.key == "Enter" ? filteredChats : null)}
          />
        </div>

        <img
          src={
            toggleAdd
              ? `${process.env.PUBLIC_URL}/minus.png`
              : `${process.env.PUBLIC_URL}/plus.png`
          }
          alt="icon"
          className="plus"
          onClick={() => setToggleAdd((toggleAdd) => !toggleAdd)}
        />
      </div>

      <div className="list">
        {filteredChats.map((chat, index) => (
          <div
            className="chats"
            key={index}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.lastmessage
                ? chat?.isSeen
                  ? "transparent"
                  : "blue"
                : "transparent",
            }}
          >
            <img src={chat.user.avatar} alt="profile-icon" />
            <div className="texts">
              <span>{chat.user.username}</span>
              <p>{chat.lastmessage}</p>
            </div>
          </div>
        ))}
      </div>

      {toggleAdd ? <Adduser /> : null}
    </div>
  );
}
