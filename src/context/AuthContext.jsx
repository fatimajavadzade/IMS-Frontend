import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("ims-user")) || null,
  );

  const [token, setToken] = useState(localStorage.getItem("ims-token"));

  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("ims-refresh-token"),
  );

  const login = (data) => {
    const { token, refreshToken, ...user } = data;

    localStorage.setItem("ims-user", JSON.stringify(user));
    localStorage.setItem("ims-token", token);
    localStorage.setItem("ims-refresh-token", refreshToken);

    setUser(user);
    setToken(token);
    setRefreshToken(refreshToken);
  };

  const logout = () => {
    localStorage.removeItem("ims-user");
    localStorage.removeItem("ims-token");
    localStorage.removeItem("ims-refresh-token");

    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

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