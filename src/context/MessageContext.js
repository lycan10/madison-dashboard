import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const { token, logout, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 20;

  const fetchConversations = useCallback(async () => {
    if (!token) {
      return;
    }
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations`,
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
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversations(data);
    } catch (err) {
      console.error("Fetch conversations error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  const fetchMessages = useCallback(async (conversationId, receiverId, isRefresh = false) => {
    if (!token || !conversationId) {
      setMessages([]);
      return;
    }
    
    setError(null);
    
    // Reset pagination when switching conversations or refreshing
    const page = isRefresh ? 1 : 1;
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/${conversationId}/messages?page=${page}&per_page=${messagesPerPage}`,
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
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      
      // Reverse the messages to show newest at bottom
      const reversedMessages = [...data.data].reverse();
      
      if (isRefresh) {
        // For refresh, only update if there are new messages
        const latestMessageTime = messages.length > 0 ? new Date(messages[messages.length - 1].created_at) : null;
        const newMessages = reversedMessages.filter(msg => 
          !latestMessageTime || new Date(msg.created_at) > latestMessageTime
        );
        
        if (newMessages.length > 0) {
          setMessages(prev => [...prev, ...newMessages]);
        }
      } else {
        setMessages(reversedMessages);
        setCurrentPage(1);
      }
      
      setHasMoreMessages(data.current_page < data.last_page);
      
      const selectedConv = conversations.find(conv => conv.id === conversationId);
      if (selectedConv) {
          setCurrentConversation(selectedConv);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
      setError(err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [token, logout, conversations, messages]);

  const loadMoreMessages = useCallback(async (conversationId, receiverId) => {
    if (!token || !conversationId || !hasMoreMessages) return;
    
    const nextPage = currentPage + 1;
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/${conversationId}/messages?page=${nextPage}&per_page=${messagesPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more messages");
      }

      const data = await response.json();
      
      // Reverse and prepend older messages to the beginning
      const olderMessages = [...data.data].reverse();
      setMessages(prev => [...olderMessages, ...prev]);
      setCurrentPage(nextPage);
      setHasMoreMessages(data.current_page < data.last_page);
      
    } catch (err) {
      console.error("Load more messages error:", err);
    }
  }, [token, currentPage, hasMoreMessages]);

  const sendMessage = async (conversationId, content) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const newMessage = await response.json();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      return true;
    } catch (error) {
      console.error("Send message error:", error);
      return false;
    }
  };

  const editMessage = async (messageId, newContent) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/messages/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newContent }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit message");
      }
      const updatedMessage = await response.json();
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? updatedMessage : msg))
      );
      return true;
    } catch (error) {
      console.error("Edit message error:", error);
      return false;
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      return true;
    } catch (error) {
      console.error("Delete message error:", error);
      return false;
    }
  };
  
  const fetchAllUsers = useCallback(async () => {
    if (!token) return [];
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        return data.filter(u => u.id !== user.id);
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
  }, [token, user]);

  const createDirectConversation = useCallback(async (userId) => {
    if (!token) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/create-direct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ receiver_id: userId }),
        }
      );
      if (!response.ok) throw new Error("Failed to create new chat");
      const newConversation = await response.json();
      setConversations(prev => {
        const exists = prev.some(conv => conv.id === newConversation.id);
        return exists ? prev : [newConversation, ...prev];
      });
      setCurrentConversation(newConversation);
      setMessages([]);
      setCurrentPage(1);
      setHasMoreMessages(false);
      return newConversation;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  }, [token]);

  return (
    <MessageContext.Provider
      value={{
        conversations,
        messages,
        currentConversation,
        loading,
        error,
        user,
        hasMoreMessages,
        fetchConversations,
        fetchMessages,
        loadMoreMessages,
        sendMessage,
        editMessage,
        deleteMessage,
        fetchAllUsers,
        createDirectConversation
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  return useContext(MessageContext);
};