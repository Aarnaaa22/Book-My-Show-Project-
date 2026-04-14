// ============================================================
// ROOT COMPONENT: App.js
// CONCEPTS DEMONSTRATED:
//   1. Redux Provider   - wraps app so ALL components access Redux store
//   2. State Lifting    - totalSaved state managed here, passed to children
//   3. React Router     - HashRouter, Routes, Route setup
//   4. Context Providers- ThemeProvider and UserProvider wrap entire app
//   5. useState         - local state for totalSaved (booking total)
//   6. useEffect        - runs when theme changes
//   7. useContext       - useTheme() to apply theme class to app container
// ============================================================

import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

// Redux: Provider makes the store available to every component in the tree
import { Provider } from "react-redux";
// Redux store: central state management
import { store } from "./redux/store";

// Context Providers (separate from Redux — demonstrates BOTH concepts)
import { ThemeProvider, UserProvider, useTheme } from "./context/AppContext";

// Components
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";

// Styles
import "./App.css";

// ---- Inner App Component ----
// Separated so it can USE context hooks (Provider must wrap the consumer)
const AppContent = () => {
  // useContext: get theme to apply correct CSS class to app wrapper
  const { theme } = useTheme();

  // ---- STATE LIFTING ----
  // totalSaved lives here (in App) and is PASSED DOWN to child pages
  // This demonstrates State Lifting — parent manages state, children receive via props
  const [totalSaved, setTotalSaved] = useState(0);

  // Callback passed DOWN to Cart page → BookingCart component
  // When booking is confirmed, child calls this → parent updates its state
  // This is State Lifting: child → parent communication via callback prop
  const handleBookingConfirmed = (amount) => {
    setTotalSaved((prev) => prev + amount);
  };

  // useEffect: side effect — runs whenever "theme" changes
  // Empty dependency array [] = run once on mount
  // [theme] = run every time theme changes
  useEffect(() => {
    console.log(`[useEffect] Theme changed to: ${theme}`);
    document.body.className = theme; // Apply theme to <body> globally
  }, [theme]);

  return (
    <div className={`app-container ${theme}`}>
      {/* Header is shown on ALL pages (outside Routes) */}
      <Header />

      {/* ---- REACT ROUTER: Client-side Navigation ---- */}
      <Routes>
        {/* Home Page — receives totalSaved as prop (State Lifting) */}
        <Route path="/" element={<Home totalSaved={totalSaved} />} />

        {/* Cart Page — receives booking confirmation callback (State Lifting) */}
        <Route
          path="/cart"
          element={<Cart onBookingConfirmed={handleBookingConfirmed} />}
        />

        {/* Profile Page */}
        <Route path="/profile" element={<Profile />} />

        {/* Auth Page */}
        <Route path="/auth" element={<Auth />} />

        {/* Fallback Route — catches unknown URLs */}
        <Route path="*" element={<Home totalSaved={totalSaved} />} />
      </Routes>
    </div>
  );
};

// ---- Main App Component ----
function App() {
  return (
    // Redux Provider: wrap entire app so every component can access Redux store
    // This is like a "global data center" for the app
    // useSelector and useDispatch only work inside this Provider
    <Provider store={store}>
      {/* Context Providers — for Theme and User (demonstrates Context API) */}
      <ThemeProvider>
        <UserProvider>
          {/* HashRouter: uses URL hash (#) — works well on GitHub Pages */}
          <HashRouter>
            <AppContent />
          </HashRouter>
        </UserProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
