import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
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
              text="Dermatologists"
              to="/Dermatologists"
              currentPath={location.pathname}
            />
            <NavItem
              text="Chat"
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
              className="text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
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




export default Navbar;
