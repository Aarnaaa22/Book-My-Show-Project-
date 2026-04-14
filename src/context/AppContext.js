// ============================================================
// REACT CONCEPT: useContext
// This file creates two Contexts:
//   1. ThemeContext - toggles dark/light mode across all components
//   2. UserContext  - tracks if user is "logged in"
// Any component can consume these without prop drilling!
// ============================================================

import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart, clearCart } from "../redux/bookingSlice";

// ---------- Theme Context ----------
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // useState: local state for theme
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook so components don't need to import ThemeContext directly
export const useTheme = () => useContext(ThemeContext);

import axios from "axios";

// ---------- User Context ----------
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.items);
  const isInitialized = useRef(false);

  // Sync cart to localStorage whenever it changes (only for logged-in users)
  // We use isInitialized to prevent overwriting the stored cart with empty state on mount
  useEffect(() => {
    if (user && user.email && isInitialized.current) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(bookings));
    }
  }, [bookings, user?.email]);

  // Load user's specific cart on mount or when user changes (e.g., login/logout)
  useEffect(() => {
    if (user && user.email) {
      const savedCart = localStorage.getItem(`cart_${user.email}`);
      if (savedCart) {
        dispatch(setCart(JSON.parse(savedCart)));
      } else {
        dispatch(setCart([]));
      }
      isInitialized.current = true;
    } else {
      dispatch(clearCart());
      isInitialized.current = false;
    }
  }, [user?.email, dispatch]);

  // Base URL for Axios requests pointing to our Node backend
  const API_URL = "http://localhost:5000/api/auth";

  // Real API Login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));

      // Explicitly load the user's cart on login to ensure immediate sync
      const savedCart = localStorage.getItem(`cart_${userData.email}`);
      dispatch(setCart(savedCart ? JSON.parse(savedCart) : []));
      isInitialized.current = true;

      return true; // Success
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw error.response?.data?.message || "Login failed";
    }
  };

  // Real API Register
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));

      // Initialize an empty cart for new user
      dispatch(setCart([]));
      isInitialized.current = true;

      return true; // Success
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    dispatch(clearCart());
    isInitialized.current = false;
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
