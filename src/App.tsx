import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./auth/Login";
import Layout from "./components/common/Layout";
import AppRoutes from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";

const MAX_IDLE_TIME = 3 * 60 * 60 * 1000; 

const App: React.FC = () => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");
    if (storedUserRole && storedToken) {
      setUserRole(storedUserRole);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("mobileNumber");
    localStorage.removeItem("userName");
    window.location.reload();
  };

  useEffect(() => {
    let idleTimer: NodeJS.Timeout | null = null;

    const resetIdleTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      idleTimer = setTimeout(logout, MAX_IDLE_TIME);
    };

    const events = ["mousedown", "keydown", "mousemove", "touchstart"];
    
    const resetTimerOnEvent = () => {
      events.forEach((event) => {
        document.addEventListener(event, resetIdleTimer);
      });
    };

    resetTimerOnEvent();
    resetIdleTimer();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, []);

  return (
    <div className="app">
      <Router>
        {userRole.length === 0 ||
        !localStorage.getItem("userRole") ||
        userRole === "" ? (
          <Login />
        ) : (
          <Layout>
            <AppRoutes />
          </Layout>
        )}
      </Router>
    </div>
  );
};

export default App;
