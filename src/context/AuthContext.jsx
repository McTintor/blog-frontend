/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  const login = (userData) => {
    console.log("userData:", userData);
    setUser(userData.user);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
