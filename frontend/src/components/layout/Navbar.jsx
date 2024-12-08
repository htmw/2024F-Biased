import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { auth, db } from "../../firebase-config"; // Import Firebase Auth
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user details from Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            name: docSnap.data().name, // Get the name from Firestore
            role: docSnap.data().role, // Optionally, include the role
          });
        } else {
          console.error("No user data found in Firestore");
        }
      } else {
        setUser(null); // Reset user when logged out
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setLogoutMessage("Logged out successfully! Redirecting...");
      setTimeout(() => {
        setLogoutMessage("");
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-light text-gray-800">
              SkinLens
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:space-x-8">
            {user?.role !== "dermatologist" && (
                <NavItem text="Upload" to="/upload" currentPath={location.pathname} />
              )}
            <NavItem text="Dermatologists" to="/dermatologists" currentPath={location.pathname} />
            {user && <NavItem text="Chat" to="/chat" currentPath={location.pathname} />} {/* Chat only visible when logged in */}
            <NavItem text="Info" to="/info" currentPath={location.pathname} />
          </div>

          {/* Authentication Buttons */}
          <div className="hidden md:flex md:items-center">
            {user ? (
              <>
                <span className="text-gray-700 mr-4">Hello, {user.name}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-light hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-800 hover:text-gray-600 px-4 py-2 text-sm font-light"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-light hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Success Message */}
      {logoutMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md text-center max-w-5xl mx-auto">
          {logoutMessage}
        </div>
      )}

    </nav>
  );
};

// Navigation Item Component
const NavItem = ({ text, to, onClick, currentPath }) => (
  <Link
    to={to}
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-150 ease-in-out ${
      currentPath === to
        ? "border-gray-800 text-gray-900"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`}
    onClick={onClick}
  >
    {text}
  </Link>
);

export default Navbar;
