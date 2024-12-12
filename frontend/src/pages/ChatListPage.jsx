import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase-config";
import { collection, query, where, doc, onSnapshot } from "firebase/firestore";
import { MessageCircle } from "lucide-react";

const ChatListPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({}); // State to store unread counts
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setErrorMessage("User not logged in.");
          return;
        }

        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("uid", "==", currentUser.uid));
        onSnapshot(userQuery, (querySnapshot) => {
          const userData = querySnapshot.docs[0]?.data();

          if (!userData) {
            setErrorMessage("Unable to fetch current user data.");
            return;
          }

          setCurrentUserData(userData);
        });
      } catch (error) {
        console.error("Error fetching current user:", error.message);
        setErrorMessage("Unable to fetch user data. Please try again.");
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserData) return;

    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const roleFilter = currentUserData.role === "patient" ? "dermatologist" : "patient";
        const userQuery = query(usersRef, where("role", "==", roleFilter));

        onSnapshot(userQuery, async (querySnapshot) => {
          const usersList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setUsers(usersList);
          fetchUnreadCounts(usersList);
        });
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setErrorMessage("Unable to load user list. Please try again later.");
      }
    };

    fetchUsers();
  }, [currentUserData]);

  const fetchUnreadCounts = (usersList) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    usersList.forEach((user) => {
      const chatId = [currentUser.uid, user.id].sort().join("-");
      const chatRef = doc(db, "chats", chatId);

      onSnapshot(chatRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const messages = docSnapshot.data().messages || [];
          setUnreadCounts((prevCounts) => ({
            ...prevCounts,
            [user.id]: messages.filter(
              (msg) => msg.receiverId === currentUser.uid && msg.status !== "read"
            ).length,
          }));
        } else {
          setUnreadCounts((prevCounts) => ({ ...prevCounts, [user.id]: 0 }));
        }
      });
    });
  };

  const handleChat = (otherUserId) => {
    navigate(`/chat/${otherUserId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-4">
        {errorMessage && (
          <div className="p-4 bg-red-100 border border-red-600 text-red-800 rounded-lg text-center shadow-md">
            {errorMessage}
          </div>
        )}
      </div>

      {currentUserData && (
        <h1 className="text-3xl font-light text-gray-900 mb-8 text-center">
          Chat with {currentUserData.role === "patient" ? "Dermatologists" : "Patients"}
        </h1>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-50 shadow-lg rounded-lg border border-gray-200 p-6 hover:shadow-xl transition-all relative"
          >
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            {unreadCounts[user.id] > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCounts[user.id]}
              </div>
            )}
            <button
              onClick={() => handleChat(user.id)}
              className="flex items-center justify-center w-full bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-all"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;
