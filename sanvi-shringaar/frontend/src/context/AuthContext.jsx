import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("ssgc_token"));
  const [username, setUsername] = useState(localStorage.getItem("ssgc_username"));

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("ssgc_token", data.token);
    localStorage.setItem("ssgc_username", data.username);
    setToken(data.token);
    setUsername(data.username);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("ssgc_token");
    localStorage.removeItem("ssgc_username");
    setToken(null);
    setUsername(null);
  };

  const value = {
    token,
    username,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
