import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../utils/constants";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("copilot_token"));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("copilot_refresh_token"));
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string; email?: string } | null>(null);

  const handleLogin = (newToken: string, newRefreshToken: string, user: { username: string; role: string; email?: string }) => {
    localStorage.setItem("copilot_token", newToken);
    localStorage.setItem("copilot_refresh_token", newRefreshToken);
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setCurrentUser(user);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("copilot_token");
    localStorage.removeItem("copilot_refresh_token");
    setToken(null);
    setRefreshToken(null);
    setCurrentUser(null);
    window.location.reload();
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      handleLogout();
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem("copilot_token", data.access_token);
      setToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      handleLogout();
      return null;
    }
  }, [refreshToken, handleLogout]);

  return {
    token,
    refreshToken,
    currentUser,
    handleLogin,
    handleLogout,
    refreshAccessToken,
  };
}
