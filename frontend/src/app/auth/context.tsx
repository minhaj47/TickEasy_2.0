"use client";

import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { JwtPayload } from "../../../types/organization";

interface AuthContextType {
  info: JwtPayload | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => JwtPayload;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [info, setInfo] = useState<JwtPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        if (!storedToken) throw new Error("No token found, Please login.");
        setToken(storedToken);

        const response = await fetch(
          "http://localhost:5001/api/auth/verify-token",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Token verification failed");

        const info = jwtDecode<JwtPayload>(storedToken);
        setInfo(info);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error in verifyToken:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = (newToken: string): JwtPayload => {
    setToken(newToken);
    localStorage.setItem("authToken", newToken);
    const info = jwtDecode<JwtPayload>(newToken);
    setInfo(info);
    localStorage.setItem("organizationData", JSON.stringify(info));
    setIsAuthenticated(true);
    return info;
  };

  const logout = () => {
    setToken(null);
    setInfo(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("organizationData");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        info,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
