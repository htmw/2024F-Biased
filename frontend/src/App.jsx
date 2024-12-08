import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import backgroundImage from "./bg.png";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ViewReport from "./components/report/viewReport";
import DermDashboardPage from "./pages/DermDashboardpage";
import { auth, db } from "./firebase-config";
import { doc, getDoc } from "firebase/firestore";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (!user) {
        setIsAuthorized(false);
        return;
      }

      if (!requiredRole) {
        setIsAuthorized(true);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === requiredRole) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading application...</div>
      </div>
    );
  }

  return (
    <Router>
      <div
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="min-h-screen bg-white bg-opacity-30">
          <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route
              path="/"
              element={
                userRole === "dermatologist" ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <HomePage />
                )
              }
            />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/report/:caseId" element={<ViewReport />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="dermatologist">
                  <DermDashboardPage />
                </ProtectedRoute>
              }
            />
            {/* Catch-all route for 404 */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-gray-800 text-xl">
                    404 - Page not found
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
