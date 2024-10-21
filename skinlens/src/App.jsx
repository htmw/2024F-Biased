import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import InfoPage from "./pages/InfoPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ChatInterface from "./components/chat/ChatInterface";
import backgroundImage from "./bg.png";

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: "user" }]);
      setInputMessage("");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Thank you for your message. A dermatologist will respond shortly.",
            sender: "dermatologist",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <Router>
      <div
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="min-h-screen bg-white bg-opacity-30">
          {" "}
          <Navbar
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
          </Routes>
          {isChatOpen && (
            <ChatInterface
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              sendMessage={sendMessage}
              setIsChatOpen={setIsChatOpen}
            />
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
