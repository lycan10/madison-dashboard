import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { token, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (pageNumber = 1) => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    if (!hasMore && pageNumber > 1) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/notifications?page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      
      setNotifications((prevNotifications) =>
        pageNumber === 1 ? data.data : [...prevNotifications, ...data.data]
      );
      setPage(data.current_page);
      setHasMore(data.last_page > data.current_page);

    } catch (err) {
      console.error("Fetch notifications error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/notifications/${notificationId}/read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      return true;
    } catch (err) {
      console.error("Mark as read error:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  return (
    <NotificationContext.Provider
      value={{ notifications, loading, error, fetchNotifications, markAsRead, page, hasMore, setPage }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};