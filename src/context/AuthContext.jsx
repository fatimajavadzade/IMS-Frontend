import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import { clearTokens, getToken, setTokens } from "../api/axios.js";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const user = localStorage.getItem("ims-user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(getToken());

  const login = useCallback((data) => {
    const {
      token: newToken,
      refreshToken: newRefreshToken,
      ...userData
    } = data;

    if (!newToken || !newRefreshToken) {
      throw new Error("Login cavabında token məlumatları yoxdur.");
    }

    localStorage.setItem("ims-user", JSON.stringify(userData));

    setTokens({
      token: newToken,
      refreshToken: newRefreshToken,
    });

    setUser(userData);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ims-user");
    clearTokens();

    setUser(null);
    setToken(null);
  }, []);

  //! Handle force logout event
  useEffect(() => {
    const handleForceLogout = () => {
      logout();
      toast.error("Sessiyanın müddəti bitib. Yenidən daxil olun.");
    };

    window.addEventListener("auth:force-logout", handleForceLogout);

    return () => {
      window.removeEventListener("auth:force-logout", handleForceLogout);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}