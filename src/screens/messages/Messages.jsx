// src/pages/messages/Messages.jsx
import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import "../order/order.css";
import "./messages.css";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  MoreVerticalIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../context/MessageContext";
import avatar from "../../assets/a4.png";

const Messages = () => {
  const {
    conversations,
    messages,
    currentConversation,
    loading,
    user,
    hasMoreMessages,
    fetchConversations,
    fetchMessages,
    loadMoreMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    fetchAllUsers,
    createDirectConversation,
    markMessagesAsRead,

  } = useMessages();
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const chatBottomRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showMenu, setShowMenu] = useState({}); // State to track which message menu is open
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const unreadHeaderRef = useRef(null);
  
  const handleSelectChat = (conversationId, receiverId) => {
    fetchMessages(conversationId, receiverId);
    markMessagesAsRead(conversationId);
  };
  
  const handleStartNewChat = async (userId) => {
    const newConv = await createDirectConversation(userId);
    if (newConv) {
      setShowNewChatModal(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !currentConversation) return;

    if (editingMessageId) {
      await editMessage(editingMessageId, currentMessage);
      setEditingMessageId(null);
    } else {
      await sendMessage(currentConversation.id, currentMessage);
    }
    setCurrentMessage("");
  };

  const handleEditClick = (message) => {
    setEditingMessageId(message.id);
    setCurrentMessage(message.content);
    setShowMenu({}); // Close the menu after clicking
  };

  const handleDeleteClick = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(messageId);
      setShowMenu({}); // Close the menu after clicking
    }
  };

  const toggleMenu = (messageId) => {
    setShowMenu((prev) => ({
      [messageId]: !prev[messageId],
    }));
  };

  // Handle scroll to load more messages
  const handleScroll = async () => {
    if (!chatContainerRef.current || !currentConversation || !hasMoreMessages || isLoadingMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const scrolledToTop = scrollTop < 100; // Load more when near top
    
    if (scrolledToTop) {
      setIsLoadingMore(true);
      const previousScrollHeight = scrollHeight;
      
      await loadMoreMessages(currentConversation.id, currentConversation.receiver_id);
      
      // Maintain scroll position after loading
      setTimeout(() => {
        if (chatContainerRef.current) {
          const newScrollHeight = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop = newScrollHeight - previousScrollHeight;
        }
        setIsLoadingMore(false);
      }, 100);
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    let unreadSectionAdded = false;
    
    messages.forEach(message => {
      const messageDate = new Date(message.created_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey;
      if (messageDate.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = messageDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }

      if (message.status === 'sent' && message.user_id !== user.id && !unreadSectionAdded) {
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push({ type: 'unread-header', id: 'unread-header' });
            unreadSectionAdded = true;
        }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  useEffect(() => {

    fetchConversations();
    fetchAllUsers().then(setUsers);
    
  }, [fetchConversations, fetchAllUsers]);

  useEffect(() => {
    let intervalId;
    if (currentConversation) {
        intervalId = setInterval(() => {
            fetchMessages(currentConversation.id, currentConversation.receiver_id, true); // true for refresh
        }, 3000);
    }
    return () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    };
  }, [currentConversation, fetchMessages]);


  useEffect(() => {
    if (unreadHeaderRef.current) {
        unreadHeaderRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (chatBottomRef.current && !isLoadingMore) {
        chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
}, [messages, currentConversation, isLoadingMore]);


  const handleCloseNewChatModal = () => setShowNewChatModal(false);
  const handleShowNewChatModal = () => setShowNewChatModal(true);

  const groupedMessages = groupMessagesByDate(messages);

  const getLastMessageDate = (conv) => {
  const messageDate = new Date(conv);
  const today = new Date();

  if (messageDate.toDateString() === today.toDateString()) {
    // Show time if today
    return messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    // Show date otherwise (MM/DD/YY)
    return messageDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    });
  }
};


  return (
    <div className="order-page">
      <div className="rightsidebar-navbar">
        <h3>Messages</h3>
        <div className="rightsidebar-button message-button" onClick={handleShowNewChatModal}>
          <HugeiconsIcon icon={Add01Icon} size={16} color="#ffffff" strokeWidth={3} />
          <p>New Chat</p>
        </div>
      </div>
      <div className="messages-container">
        <div className="messages-list-container">
          <div className="messages-list-pinned">
            <h1>CONVERSATIONS</h1>
            <div className="messages-pinned-list">
              {loading ? (
                <p style={{ padding: "10px" }}>Loading conversations...</p>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    className="messages-pinned-container"
                    key={conv.id}
                    onClick={() => handleSelectChat(conv.id, conv.receiver_id)}
                    style={{ backgroundColor: currentConversation?.id === conv.id ? "#f1f1f1" : "transparent" }}
                  >
                    <div className="messages-pinned">
                      <div className="messages-pinned-image">
                        <img src={avatar} alt="user avatar" />
                      </div>
                      {conv.unread_count > 0 && (
                      <div className="unread-count-badge">{conv.unread_count}</div>
                    )}
                      <div className="message-pinned-texts">
                        <div className="message-pinned-texts-title">
                          <h1>{conv.name}</h1>
                        </div>
                        <p>{conv.last_message_content?.length > 20 ? conv.last_message_content.slice(0, 19) + "..." : conv.last_message_content}</p>
                      </div>
                      <p>{getLastMessageDate(conv.last_message_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: "10px" }}>No conversations found.</p>
              )}
            </div>
          </div>
        </div>
        {currentConversation ? (
          <div className="messages-chats">
            <div className="messages-chats-top">
              <div className="messages-pinned">
                <div className="messages-pinned-image">
                  <img src={avatar} alt="conversation avatar" />
                </div>
                <div className="message-pinned-texts">
                  <h1>{currentConversation.name}</h1>
                </div>
              </div>
              <div className="message-chat-top-icon">
                <HugeiconsIcon icon={MoreVerticalIcon} />
              </div>
            </div>
            <div 
              className="messages-chat-middle"
              ref={chatContainerRef}
              onScroll={handleScroll}
            >
              {isLoadingMore && (
                <div className="loading-more">
                  <p>Loading more messages...</p>
                </div>
              )}
              
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="message-chat-date">
                    <p>{date}</p>
                  </div>
                  {dateMessages.map((message) => {
                    if (message.type === 'unread-header') {
                      return (
                          <div key="unread-header-label" className="unread-header" ref={unreadHeaderRef}>
                              <hr />
                              <span>Unread Messages</span>
                              <hr />
                          </div>
                      );
                  }
                  return (
                    <div
                      key={message.id}
                      className={`message-chat-user ${message.user_id === user.id ? "main-user" : ""}`}
                    >
                      <div className="messages-pinned">
                        <div className="messages-pinned-image">
                          <img src={avatar} alt="user avatar" />
                        </div>
                        <div className="message-pinned-texts">
                          <div className="d-flex flex-row justify-content-between align-items-center">
                            <div className="d-flex flex-row align-items-center">
                              <h1>{message.user_name}</h1>
                              <small className="message-time">{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                            </div>
                            {message.user_id === user.id && (
                              <div className="message-actions-container">
                                <button 
                                  className="more-options-btn" 
                                  onClick={() => toggleMenu(message.id)}
                                >
                                  <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                                </button>
                                {showMenu[message.id] && (
                                  <div className="message-actions-menu">
                                    <button onClick={() => handleEditClick(message)}>Edit</button>
                                    <button onClick={() => handleDeleteClick(message.id)}>Delete</button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    </div>)
                })}
                </div>
              ))}
              <div ref={chatBottomRef}></div>
            </div>
            <div className="messages-chats-bottom">
              <form onSubmit={handleSendMessage} className="messages-input-form">
                <div className="message-chat-input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                  />
                </div>
                <button type="submit" className="message-chat-bottom-icon">
                  <HugeiconsIcon icon={SentIcon} size={16} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="messages-placeholder">
            <p>Select a conversation to view messages</p>
          </div>
        )}
      </div>

      <Modal show={showNewChatModal} onHide={handleCloseNewChatModal} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title><h3>New Chat</h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {users.map((u) => (
            <div className="messages-pinned new-chat" key={u.id} onClick={() => handleStartNewChat(u.id)}>
              <div className="messages-pinned-image">
                <img src={avatar} />
              </div>
              <div className="message-pinned-texts">
                <h1>{u.name}</h1>
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-secondary" onClick={handleCloseNewChatModal}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Messages;