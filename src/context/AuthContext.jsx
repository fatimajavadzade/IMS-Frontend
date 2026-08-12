import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  clearTokens,
  getRefreshToken,
  getToken,
  setTokens,
} from "../api/axios.js";

const AuthContext = createContext(null);
//! deyise biler

const USER_KEY = "ims-user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(getToken());
  const [refreshToken, setRefreshTokenState] = useState(getRefreshToken());

  // login cavabı { token, refreshToken, ...user } formasındadır.
  const login = useCallback((data) => {
    const {
      token: newToken,
      refreshToken: newRefreshToken,
      ...userData
    } = data;

    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setTokens({ token: newToken, refreshToken: newRefreshToken });

    setUser(userData);
    setToken(newToken);
    setRefreshTokenState(newRefreshToken);
  }, []);

  // Yalnız client-side sessiyanı təmizləyir. Backend-ə "logout" sorğusu
  // src/hooks/auth/useLogout.js vasitəsilə ayrıca göndərilir.
  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    clearTokens();

    setUser(null);
    setToken(null);
    setRefreshTokenState(null);
  }, []);

  // axios.js-dəki interceptor refresh token ilə tokeni yeniləyə bilmədikdə
  // ("auth:force-logout" hadisəsini yayır) sessiyanı burada təmizləyirik ki,
  // ProtectedRoute avtomatik olaraq istifadəçini /login-ə yönləndirsin.
  useEffect(() => {
    const handleForceLogout = () => {
      logout();
      toast.error("Sessiyanın müddəti bitib. Yenidən daxil olun.");
    };

    window.addEventListener("auth:force-logout", handleForceLogout);

    return () =>
      window.removeEventListener("auth:force-logout", handleForceLogout);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
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