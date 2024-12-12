import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase-config";
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import Picker from "emoji-picker-react";
import { Upload } from "lucide-react";

const ChatPage = () => {
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [otherUserName, setOtherUserName] = useState("User");
  const [unreadCount, setUnreadCount] = useState(0); // Notification state
  const chatBoxRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  if (!currentUser || !otherUserId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Invalid chat setup. Please try again.
      </div>
    );
  }

  const chatId = [currentUser.uid, otherUserId].sort().join("-");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userRef = doc(db, "users", otherUserId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setOtherUserName(userDoc.data().name || "User");
        }
      } catch (error) {
        console.error("Error fetching user name:", error.message);
        setOtherUserName("User");
      }
    };
    fetchUserName();
  }, [otherUserId]);

  useEffect(() => {
    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatRef, async (snapshot) => {
      if (snapshot.exists()) {
        const updatedMessages = snapshot.data().messages || [];
        const unreadMessages = updatedMessages.filter(
          (msg) => msg.receiverId === currentUser.uid && msg.status !== "read"
        );
        setUnreadCount(unreadMessages.length);

        const newMessages = updatedMessages.map((msg) => {
          if (msg.receiverId === currentUser.uid && msg.status === "sent") {
            return { ...msg, status: "delivered" };
          }
          return msg;
        });

        setMessages(newMessages);

        if (JSON.stringify(updatedMessages) !== JSON.stringify(newMessages)) {
          await updateDoc(chatRef, { messages: newMessages });
        }
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [chatId, currentUser?.uid]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;

      const markMessagesAsRead = async () => {
        const chatRef = doc(db, "chats", chatId);

        const newMessages = messages.map((msg) => {
          if (msg.receiverId === currentUser.uid && msg.status === "delivered") {
            return { ...msg, status: "read" };
          }
          return msg;
        });

        if (JSON.stringify(messages) !== JSON.stringify(newMessages)) {
          await updateDoc(chatRef, { messages: newMessages });
          setMessages(newMessages);
        }
      };

      markMessagesAsRead();
      setUnreadCount(0); // Reset unread count when messages are read
    }
  }, [messages, chatId, currentUser?.uid]);

  const sendMessage = async (imageUrl = null) => {
    if (!newMessage.trim() && !imageUrl) return;

    const messageData = {
      senderId: currentUser.uid,
      receiverId: otherUserId,
      message: newMessage.trim(),
      imageUrl,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    try {
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        const existingMessages = chatDoc.data().messages || [];
        await updateDoc(chatRef, { messages: [...existingMessages, messageData] });
      } else {
        await setDoc(chatRef, { messages: [messageData] });
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
      setErrorMessage("Unable to send message. Please try again later.");
    }
  };

  const handleFileUpload = async (file) => {
    const storage = getStorage();
    const fileRef = ref(storage, `chat-images/${chatId}/${file.name}`);
    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      sendMessage(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      setErrorMessage("Unable to upload image. Please try again later.");
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const getStatusIcon = (status) => {
    if (status === "sent") return "✔️";
    if (status === "delivered") return "✔✔";
    if (status === "read") return "✔✔"; // Can add a blue color if required
    return "";
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-lg mx-auto bg-[#f7ede2] shadow-lg rounded-lg">
      <div className="flex items-center justify-between bg-gray-800 text-white px-6 py-3 shadow-md rounded-t-lg">
        <button onClick={() => navigate(-1)} className="text-lg">
          ←
        </button>
        <h1 className="text-lg font-semibold">{otherUserName}</h1>
        <div className="relative">
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-lg shadow-md ${
                msg.senderId === currentUser.uid ? "bg-[#c28771] text-white" : "bg-white text-[#4f4f4f]"
              }`}
              style={{ maxWidth: "70%" }}
            >
              {msg.imageUrl ? (
                <img
                  src={msg.imageUrl}
                  alt="Sent"
                  className="rounded-lg shadow-md max-w-full"
                />
              ) : (
                <p className="text-sm">{msg.message}</p>
              )}
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
                {msg.senderId === currentUser.uid && (
                  <span
                    className={`text-xs ${
                      msg.status === "read" ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    {getStatusIcon(msg.status)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}
      </div>

      <div className="relative p-3 bg-white shadow-md rounded-b-lg">
        {showEmojiPicker && (
          <Picker
            onEmojiClick={handleEmojiClick}
            pickerStyle={{ position: "absolute", bottom: "70px", left: "10px" }}
          />
        )}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-2xl text-[#4a403a]"
          >
            😊
          </button>
          <label className="cursor-pointer">
            <Upload className="h-6 w-6 text-[#4a403a]" />
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
            />
          </label>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleTyping}
            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#c28771] focus:outline-none bg-[#fefcfb]"
          />
          <button
            onClick={() => sendMessage()}
            className="bg-gray-800 text-white px-4 py-1 text-sm rounded-lg hover:bg-[#3a332d] transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
