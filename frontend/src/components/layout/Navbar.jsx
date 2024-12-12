import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { auth, db } from "../../firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            name: docSnap.data().name,
            role: docSnap.data().role,
          });
        } else {
          console.error("No user data found in Firestore");
        }
      } else {
        setUser(null);
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

  const handleProtectedRoute = (route, allowedRoles) => {
    if (!user || !allowedRoles.includes(user.role)) {
      setWarningMessage("Log in to access this feature.");
      setTimeout(() => setWarningMessage(""), 3000);
    } else {
      navigate(route);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-light text-gray-800">
              SkinLens
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {(user?.role === "patient" || !user) && (
              <NavItem text="Upload" to="/upload" currentPath={location.pathname} />
            )}
            {(user?.role === "patient" || !user) && (
              <button
                onClick={() => handleProtectedRoute("/records", ["patient"])}
                className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-150 ease-in-out border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Records
              </button>
            )}
            {user?.role === "dermatologist" && (
              <NavItem text="Reports" to="/reports" currentPath={location.pathname} />
            )}
            {user && (user.role === "patient" || user.role === "dermatologist") && (
              <button
                onClick={() => navigate("/chat-list")}
                className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-150 ease-in-out border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Chat
              </button>
            )}
            <NavItem text="Info" to="/info" currentPath={location.pathname} />
          </div>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Hello, {user.name}</span>
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-2 space-y-2 bg-white border-t border-gray-200">
          {(user?.role === "patient" || !user) && (
            <NavItem text="Upload" to="/upload" currentPath={location.pathname} />
          )}
          {(user?.role === "patient" || !user) && (
            <button
              onClick={() => handleProtectedRoute("/records", ["patient"])}
              className="block text-left w-full px-2 py-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Records
            </button>
          )}
          {user?.role === "dermatologist" && (
            <NavItem text="Reports" to="/reports" currentPath={location.pathname} />
          )}
          {user && (user.role === "patient" || user.role === "dermatologist") && (
            <button
              onClick={() => navigate("/chat-list")}
              className="block text-left w-full px-2 py-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Chat
            </button>
          )}
          <NavItem text="Info" to="/info" currentPath={location.pathname} />
          {user ? (
            <button
              onClick={handleSignOut}
              className="block text-left w-full px-2 py-1 text-sm font-medium text-red-500 hover:bg-red-100"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="block text-left w-full px-2 py-1 text-sm font-medium text-gray-800 hover:text-gray-600">
                Login
              </Link>
              <Link to="/signup" className="block text-left w-full px-2 py-1 text-sm font-medium text-gray-800 hover:text-gray-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      {/* Logout Success Message */}
      {logoutMessage && (
        <div
          className="absolute top-15 left-1/2 transform -translate-x-1/2 p-4 bg-green-100 text-green-800 rounded-md text-center max-w-5xl shadow-md z-50"
          style={{ width: "90%", maxWidth: "500px" }}
        >
          {logoutMessage}
        </div>
      )}

      {/* Warning Message */}
      {warningMessage && (
        <div
          className="absolute top-15 left-1/2 transform -translate-x-1/2 p-4 bg-yellow-100 text-yellow-800 rounded-md text-center max-w-5xl shadow-md z-50"
          style={{ width: "90%", maxWidth: "500px" }}
        >
          {warningMessage}
        </div>
      )}
    </nav>
  );
};

// Navigation Item Component
const NavItem = ({ text, to, onClick, currentPath }) => (
  <Link
    to={to}
    className={`block text-left px-2 py-1 text-sm font-medium ${
      currentPath === to ? "text-gray-900 font-semibold" : "text-gray-500"
    } hover:text-gray-700`}
    onClick={onClick}
  >
    {text}
  </Link>
);

export default Navbar;
