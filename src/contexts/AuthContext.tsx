
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  studentId: string;
  major: string;
  batch: string;
  profilePic?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, "id"> & { password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would verify credentials with a backend
    try {
      // Mock login for demo purposes
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = storedUsers.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const register = async (userData: Omit<User, "id"> & { password: string }) => {
    try {
      // In a real app, this would send data to a backend
      // Mock registration for demo purposes
      const newUser = {
        ...userData,
        id: Date.now().toString(),
      };
      
      // Store user in localStorage (only for demo)
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if email already exists
      if (storedUsers.some((u: any) => u.email === userData.email)) {
        throw new Error("Email already registered");
      }
      
      // Check if student ID already exists
      if (storedUsers.some((u: any) => u.studentId === userData.studentId)) {
        throw new Error("Student ID already registered");
      }
      
      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      
      // Login the user after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
