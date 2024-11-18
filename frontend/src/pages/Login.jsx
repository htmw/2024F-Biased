import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Logged in successfully! Redirecting...");
      setError("");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      setError(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-light text-gray-800 mb-8 text-center">Login</h1>
      <form onSubmit={handleLogin} className="space-y-6">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700"
        >
          Login
        </button>
      </form>
      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md text-center">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default Login;
