import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const MembersContext = createContext(null);

export const MembersProvider = ({ children }) => {
  const { token, logout } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users`,
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
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error("Fetch members error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);
  
  const createMember = async (formData) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create member");
      }
      const newMember = await response.json();
      setMembers(prev => [...prev, newMember.user]);
      return true;
    } catch (err) {
      console.error("Create member error:", err);
      setError(err.message);
      return false;
    }
  };

  const updateMember = async (memberId, formData) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users/${memberId}`,
        {
          method: "POST", // Laravel uses POST for PUT/PATCH with form data
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update member");
      }
      const updatedMember = await response.json();
      setMembers(prev => prev.map(m => m.id === memberId ? updatedMember.user : m));
      return true;
    } catch (err) {
      console.error("Update member error:", err);
      setError(err.message);
      return false;
    }
  };

  const banMember = async (memberId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users/${memberId}/ban`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to ban member");
      }
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: 'banned' } : m));
      return true;
    } catch (err) {
      console.error("Ban member error:", err);
      setError(err.message);
      return false;
    }
  };

  const unbanMember = async (memberId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users/${memberId}/unban`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to unban member");
      }
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: 'active' } : m));
      return true;
    } catch (err) {
      console.error("Unban member error:", err);
      setError(err.message);
      return false;
    }
  };

  const deleteMember = async (memberId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users/${memberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete member");
      }
      setMembers(prev => prev.filter(m => m.id !== memberId));
      return true;
    } catch (err) {
      console.error("Delete member error:", err);
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <MembersContext.Provider
      value={{
        members,
        loading,
        error,
        fetchMembers,
        createMember,
        updateMember,
        banMember,
        unbanMember,
        deleteMember,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => useContext(MembersContext);
