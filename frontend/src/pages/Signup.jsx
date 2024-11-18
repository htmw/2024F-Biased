import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        uid: user.uid,
      });

      setSuccessMessage("Account created successfully! Redirecting...");
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
      <h1 className="text-2xl font-light text-gray-800 mb-8 text-center">Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-6">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <div className="w-full">
          <label htmlFor="role" className="block text-sm text-gray-700 mb-2">
            Role:
          </label>
          <select
            id="role"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="dermatologist">Dermatologist</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700"
        >
          Sign Up
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

export default Signup;
