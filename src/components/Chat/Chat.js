import { arrayUnion, onSnapshot } from "firebase/firestore";
import "./chat.css";
import { useState, useRef, useEffect } from "react";
import { Chatstore } from "../../lib/Chatstore";
import { db, storage } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Userstore } from "../../lib/Userstore";
import EmojiPicker from "emoji-picker-react";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const Chat = () => {
  const [text, setText] = useState("");
  const endRef = useRef(null);
  const [chat, setChat] = useState([]);
  const [emoclicked, setEmoclicked] = useState(false);
  const { user } = Userstore();
  const { chatId, chatlistuser } = Chatstore();
  const [attachment, setAttachment] = useState();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, []);

  useEffect(() => {
    console.log("reached chat component");
    if (chatId) {
      const unsub = onSnapshot(doc(db, "chats", chatId), (res) => {
        if (res.exists()) {
          setChat(res.data());
        } else {
          console.log("No such document!");
        }
      });
      return () => {
        unsub();
      };
    } else {
      console.log("chatId is undefined");
    }
  }, [chatId]);

  const handleAttachment = async (e) => {
    console.log(e.target.files[0]);
    setAttachment(e.target.files[0]);
    console.log(attachment);
  };

  const handleSend = async () => {
    console.log("handle send");
    console.log(attachment);
    console.log(text);

    try {
      console.log("try block");
      if (!chatId) {
        return;
      }

      let url = null;
      if (attachment) {
        const date = Date.now();
        const storageRef = ref(
          storage,
          `chat-images/${attachment.name + date}`
        );
        await uploadBytes(storageRef, attachment);
        url = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          text,
          createdAt: new Date(),
          senderId: user.id,
          img: url,
        }),
      });

      const userIds = [user?.id, chatlistuser?.id];

      userIds.forEach(async (id) => {
        const res = await getDoc(doc(db, "userchats", id));
        const userChatsData = res.data();
        const chatIndex = userChatsData.chats.findIndex(
          (c) => c.chatId == chatId
        );
        userChatsData.chats[chatIndex].lastmessage = text;
        userChatsData.chats[chatIndex].isSeen = id === user.id ? true : false;
        userChatsData.chats[chatIndex].updatedAt = Date.now();

        await updateDoc(doc(db, "userchats", id), {
          chats: userChatsData.chats,
        });
      });
      setText("");
      setAttachment(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmojis = () => {
    setEmoclicked((emoclicked) => !emoclicked);
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="userinfo">
          <img src={chatlistuser.avatar} />
          <div className="text">
            <h2 style={{ color: "white", marginBottom: 0 }}>
              {chatlistuser?.username}
            </h2>
            <p style={{ color: "pink", marginTop: 0 }}>
              {chatlistuser?.about || "Busy...."}
            </p>
          </div>
        </div>
        <div className="icons">
          <img src={`${process.env.PUBLIC_URL}/phone.png`} />
          <img src={`${process.env.PUBLIC_URL}/video.png`} />
          <img src={`${process.env.PUBLIC_URL}/info.png`} />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={message.senderId == user?.id ? "message own" : "message"}
          >
            <div className="textmessage">
              {message.img && <img src={message.img} alt="sent a pic" />}
              <p>{message.text}</p>
              <span>1 min ago</span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="text">
          <label htmlFor="attachment">
            <img src={`${process.env.PUBLIC_URL}/attach.png`} />
          </label>
          <input type="file" id="attachment" onChange={handleAttachment} />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) =>
              e.key == "Enter"
                ? text || attachment
                  ? handleSend()
                  : null
                : null
            }
          />
          <img src={`${process.env.PUBLIC_URL}/mic.png`} />
          <img
            src={`${process.env.PUBLIC_URL}/emoji.png`}
            onClick={handleEmojis}
          />
          <img
            src={`${process.env.PUBLIC_URL}/heart.png`}
            onClick={() => setText((text) => text + "❤️")}
          />
        </div>

        <button onClick={handleSend}>Send</button>
      </div>
      <div className="emoparent">
        {emoclicked ? (
          <EmojiPicker
            height={500}
            width={400}
            position={"absolete"}
            onEmojiClick={(emo) => setText((text) => text + emo.emoji)}
          />
        ) : null}
      </div>
    </div>
  );
};
export default Chat;
