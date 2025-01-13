/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if a token exists in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user"); // Get user data stored in localStorage
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData)); // Set user data if available
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  const login = (userData) => {
    console.log("userData:", userData);
    setUser(userData.user);
    localStorage.setItem("token", userData.token); // Store token in localStorage
    localStorage.setItem("user", JSON.stringify(userData.user)); // Store user data in localStorage
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("user"); // Remove user data from localStorage
    setUser(null); // Clear user state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
