import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import backgroundImage from "./bg.png";

const App = () => {
  
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>

        </div>
      </div>
    </Router>
  );
};

export default App;
