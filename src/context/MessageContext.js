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
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  
  const [globalGroupChat, setGlobalGroupChat] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

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
      const total = data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
      setTotalUnreadCount(total);
      
      // Find global group chat if it exists
      const globalChat = data.find(conv => conv.type === 'group' && conv.is_global);
      if (globalChat) {
        setGlobalGroupChat(globalChat);
      }
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
      
      const reversedMessages = [...data.data].reverse();
      
      if (isRefresh) {
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

  const markMessagesAsRead = useCallback(async (conversationId) => {
    if (!token || !conversationId) return;

    try {
        await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/conversations/${conversationId}/messages/mark-read`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setConversations(prev => prev.map(conv =>
            conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        ));

        setTotalUnreadCount(prev => prev - (conversations.find(c => c.id === conversationId)?.unread_count || 0));

    } catch (err) {
        console.error("Mark as read error:", err);
    }
  }, [token, conversations]);

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

  const fetchGlobalGroupChat = useCallback(async () => {
    if (!token) return null;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/global-group`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch global group chat");
      const globalChat = await response.json();
      setGlobalGroupChat(globalChat);
      
      setConversations(prev => {
        const exists = prev.some(conv => conv.id === globalChat.id);
        return exists ? prev : [globalChat, ...prev];
      });
      
      return globalChat;
    } catch (error) {
      console.error("Error fetching global group chat:", error);
      return null;
    }
  }, [token]);

  const createCustomGroupChat = useCallback(async (name, description, participantIds) => {
    if (!token) return null;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/group`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            participant_ids: participantIds,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to create group chat");
      const newGroupChat = await response.json();
      
      setConversations(prev => [newGroupChat, ...prev]);
      return newGroupChat;
    } catch (error) {
      console.error("Error creating group chat:", error);
      return null;
    }
  }, [token]);

  const fetchGroupParticipants = useCallback(async (conversationId) => {
    if (!token || !conversationId) return [];
    setLoadingParticipants(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/${conversationId}/participants`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch participants");
      const participantsData = await response.json();
      setParticipants(participantsData);
      return participantsData;
    } catch (error) {
      console.error("Error fetching participants:", error);
      return [];
    } finally {
      setLoadingParticipants(false);
    }
  }, [token]);

  const addParticipants = useCallback(async (conversationId, userIds) => {
    if (!token) return false;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/${conversationId}/participants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_ids: userIds }),
        }
      );
      if (!response.ok) throw new Error("Failed to add participants");
      
      fetchGroupParticipants(conversationId);
      return true;
    } catch (error) {
      console.error("Error adding participants:", error);
      return false;
    }
  }, [token, fetchGroupParticipants]);

  const removeParticipant = useCallback(async (conversationId, userId) => {
    if (!token) return false;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/${conversationId}/participants/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to remove participant");
      
      fetchGroupParticipants(conversationId);
      return true;
    } catch (error) {
      console.error("Error removing participant:", error);
      return false;
    }
  }, [token, fetchGroupParticipants]);

  const leaveGroup = useCallback(async (conversationId) => {
    if (!token) return false;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/${conversationId}/leave`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to leave group");
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      
      return true;
    } catch (error) {
      console.error("Error leaving group:", error);
      return false;
    }
  }, [token, currentConversation]);

  const joinGroup = useCallback(async (conversationId) => {
    if (!token) return false;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/${conversationId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to join group");
      return true;
    } catch (error) {
      console.error("Error joining group:", error);
      return false;
    }
  }, [token]);

  const updateGroupInfo = useCallback(async (conversationId, name, description) => {
    if (!token) return false;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/conversations/${conversationId}/info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, description }),
        }
      );
      if (!response.ok) throw new Error("Failed to update group info");
      
      const updatedGroup = await response.json();
      
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, name: updatedGroup.conversation.name, description: updatedGroup.conversation.description }
          : conv
      ));
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev => ({ 
          ...prev, 
          name: updatedGroup.conversation.name, 
          description: updatedGroup.conversation.description 
        }));
      }
      
      return true;
    } catch (error) {
      console.error("Error updating group info:", error);
      return false;
    }
  }, [token, currentConversation]);

  return (
    <MessageContext.Provider
      value={{
        conversations,
        messages,
        setMessages,
        currentConversation,
        setCurrentConversation,
        loading,
        error,
        user,
        hasMoreMessages,
        totalUnreadCount,
        globalGroupChat,
        participants,
        loadingParticipants,
        fetchConversations,
        fetchMessages,
        loadMoreMessages,
        sendMessage,
        editMessage,
        deleteMessage,
        fetchAllUsers,
        createDirectConversation,
        markMessagesAsRead,
        fetchGlobalGroupChat,
        createCustomGroupChat,
        fetchGroupParticipants,
        addParticipants,
        removeParticipant,
        leaveGroup,
        joinGroup,
        updateGroupInfo,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  return useContext(MessageContext);
};