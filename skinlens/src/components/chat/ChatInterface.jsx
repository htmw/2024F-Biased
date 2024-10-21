import React from "react";
import { X, Send } from "lucide-react";

const ChatInterface = ({
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  setIsChatOpen,
}) => (
  <div className="fixed bottom-4 right-4 w-80 bg-white shadow-2xl rounded-lg flex flex-col overflow-hidden">
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h3 className="text-lg font-light">Chat with Dermatologist</h3>
      <button
        onClick={() => setIsChatOpen(false)}
        className="text-white hover:text-gray-300 focus:outline-none"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
    <div
      className="flex-grow overflow-y-auto p-4 space-y-4"
      style={{ height: "350px" }}
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[75%] p-3 rounded-lg ${
              message.sender === "user"
                ? "bg-blue-100 text-gray-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
    <div className="p-4 bg-gray-50">
      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-800">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
        />
        <button
          onClick={sendMessage}
          className="bg-gray-800 text-white px-3 py-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-150 ease-in-out"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

export default ChatInterface;
