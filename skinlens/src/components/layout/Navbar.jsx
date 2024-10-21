import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = ({ isChatOpen, setIsChatOpen, isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-light text-gray-800">
              SkinLens
            </Link>
          </div>
          <div className="hidden md:flex md:space-x-8">
            <NavItem
              text="Upload"
              to="/upload"
              currentPath={location.pathname}
            />
            <NavItem
              text="Appointments"
              to="/appointments"
              currentPath={location.pathname}
            />
            <NavItem
              text="Chat"
              onClick={() => setIsChatOpen(!isChatOpen)}
              currentPath={location.pathname}
            />
            <NavItem text="Info" to="/info" currentPath={location.pathname} />
          </div>
          <div className="hidden md:flex md:items-center">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-light hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out">
              Sign Up
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <MobileMenu
          setIsChatOpen={setIsChatOpen}
          isChatOpen={isChatOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}
    </nav>
  );
};

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

const MobileMenu = ({ setIsChatOpen, isChatOpen, setIsMenuOpen }) => (
  <div className="md:hidden">
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <MobileMenuItem
        text="Upload"
        to="/upload"
        setIsMenuOpen={setIsMenuOpen}
      />
      <MobileMenuItem
        text="Appointments"
        to="/appointments"
        setIsMenuOpen={setIsMenuOpen}
      />
      <MobileMenuItem
        text="Chat"
        onClick={() => {
          setIsChatOpen(!isChatOpen);
          setIsMenuOpen(false);
        }}
      />
      <MobileMenuItem text="Info" to="/info" setIsMenuOpen={setIsMenuOpen} />
    </div>
    <div className="pt-4 pb-3 border-t border-gray-200">
      <div className="px-2">
        <button
          onClick={() => setIsMenuOpen(false)}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700"
        >
          Sign Up
        </button>
      </div>
    </div>
    <button
      onClick={() => setIsMenuOpen(false)}
      className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-600"
    >
      <X className="h-6 w-6" />
    </button>
  </div>
);

const MobileMenuItem = ({ text, to, onClick, setIsMenuOpen }) => (
  <Link
    to={to}
    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    onClick={() => {
      if (onClick) {
        onClick();
      } else {
        setIsMenuOpen(false);
      }
    }}
  >
    {text}
  </Link>
);

export default Navbar;
