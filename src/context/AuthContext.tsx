// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import type { UserType, MovieType, DecodedTokenType } from "../types";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://bioskop-ml-mikro.duckdns.org";

const decodeTokenToUser = (token: string): UserType | null => {
  try {
    const decoded = jwtDecode<DecodedTokenType>(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return { email: decoded.sub };
  } catch (e) {
    localStorage.removeItem("token");
    return null;
  }
};

interface AuthContextType {
  currentUser: UserType | null;
  token: string | null;
  recommendations: MovieType[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [recommendations, setRecommendations] = useState<MovieType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const user = decodeTokenToUser(storedToken);
      if (user) {
        setCurrentUser(user);
        setToken(storedToken);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${BASE_URL}/api/v1/recommendation`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      }
    };
    if (!isLoading && token) fetchRecommendations();
  }, [token, isLoading]);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    const accessToken = data.access_token; // Fixed to match your API response

    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    setCurrentUser(decodeTokenToUser(accessToken));
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, recommendations, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
