import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import "../order/order.css";
import "./messages.css";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  MoreVerticalIcon,
  SentIcon,
  UserGroupIcon,
  UserIcon,
  SettingsIcon,
  LeaveIcon,
  AddTeam02FreeIcons,
  Delete04Icon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../context/MessageContext";
import avatar from "../../assets/a4.png";

const Messages = () => {
  const {
    conversations,
    messages,
    setMessages,
    currentConversation,
    setCurrentConversation,
    loading,
    user,
    hasMoreMessages,
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
    updateGroupInfo,
  } = useMessages();

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const chatBottomRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showMenu, setShowMenu] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const unreadHeaderRef = useRef(null);

  const [chatType, setChatType] = useState("direct");
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showAddParticipantsModal, setShowAddParticipantsModal] =
    useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  const handleSelectChat = (conversationId, receiverId) => {
    fetchMessages(conversationId, receiverId);
    markMessagesAsRead(conversationId);

    const conversation = conversations.find(
      (conv) => conv.id === conversationId
    );
    if (conversation && conversation.type === "group") {
      fetchGroupParticipants(conversationId);
    }
  };

  const handleStartNewChat = async (userId) => {
    const newConv = await createDirectConversation(userId);
    if (newConv) {
      setShowNewChatModal(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedParticipants.length === 0) return;

    const groupChat = await createCustomGroupChat(
      groupName,
      groupDescription,
      selectedParticipants
    );

    if (groupChat) {
      setShowNewGroupModal(false);
      setGroupName("");
      setGroupDescription("");
      setSelectedParticipants([]);
      setCurrentConversation(groupChat);
      fetchMessages(groupChat.id);
    }
  };

  const handleJoinGlobalChat = async () => {
    const globalChat = await fetchGlobalGroupChat();
    if (globalChat) {
      setCurrentConversation(globalChat);
      fetchMessages(globalChat.id);
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
    setShowMenu({});
  };

  const handleDeleteClick = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(messageId);
      setShowMenu({});
    }
  };

  const toggleMenu = (messageId) => {
    setShowMenu((prev) => ({
      [messageId]: !prev[messageId],
    }));
  };

  const handleScroll = async () => {
    if (
      !chatContainerRef.current ||
      !currentConversation ||
      !hasMoreMessages ||
      isLoadingMore
    )
      return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const scrolledToTop = scrollTop < 100;

    if (scrolledToTop) {
      setIsLoadingMore(true);
      const previousScrollHeight = scrollHeight;

      await loadMoreMessages(
        currentConversation.id,
        currentConversation.receiver_id
      );

      setTimeout(() => {
        if (chatContainerRef.current) {
          const newScrollHeight = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop =
            newScrollHeight - previousScrollHeight;
        }
        setIsLoadingMore(false);
      }, 100);
    }
  };

  const handleLeaveGroup = async () => {
    if (window.confirm("Are you sure you want to leave this group?")) {
      const success = await leaveGroup(currentConversation.id);
      if (success) {
        setCurrentConversation(null);
        setMessages([]);
      }
    }
  };

  const handleAddParticipants = async () => {
    if (selectedParticipants.length === 0) return;

    const success = await addParticipants(
      currentConversation.id,
      selectedParticipants
    );
    if (success) {
      setShowAddParticipantsModal(false);
      setSelectedParticipants([]);
      fetchGroupParticipants(currentConversation.id);
    }
  };

  const handleRemoveParticipant = async (userId) => {
    if (window.confirm("Are you sure you want to remove this participant?")) {
      await removeParticipant(currentConversation.id, userId);
    }
  };

  const toggleParticipantSelection = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    let unreadSectionAdded = false;

    messages.forEach((message) => {
      const messageDate = new Date(message.created_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey;
      if (messageDate.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        dateKey = "Yesterday";
      } else {
        dateKey = messageDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      if (
        currentConversation?.type === "direct" &&
        message.status === "sent" &&
        message.user_id !== user.id &&
        !unreadSectionAdded
      ) {
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push({ type: "unread-header", id: "unread-header" });
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
        fetchMessages(
          currentConversation.id,
          currentConversation.receiver_id,
          true
        );
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
      unreadHeaderRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (chatBottomRef.current && !isLoadingMore) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentConversation, isLoadingMore]);

  useEffect(() => {
    if (currentConversation?.type === "group" && participants.length > 0) {
      const participantIds = participants.map((p) => p.user_id);
      setAvailableUsers(
        users.filter((user) => !participantIds.includes(user.id))
      );
    } else {
      setAvailableUsers(users);
    }
  }, [users, participants, currentConversation]);

  const handleCloseNewChatModal = () => setShowNewChatModal(false);
  const handleShowNewChatModal = () => setShowNewChatModal(true);

  const groupedMessages = groupMessagesByDate(messages);

  const getLastMessageDate = (conv) => {
    const messageDate = new Date(conv);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      });
    }
  };

  const getConversationIcon = (conversation) => {
    return conversation.type === "group" ? UserGroupIcon : UserIcon;
  };

  const getConversationName = (conversation) => {
    if (conversation.type === "group") {
      return conversation.name;
    }
    return conversation.name;
  };

  const teamMessages = conversations
    .filter((conv) => conv.type === "group")
    .sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));

  const allMessages = conversations
    .filter((conv) => conv.type !== "group")
    .sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));

  return (
    <div className="order-page">
      <div className="rightsidebar-navbar">
        <h3>Messages</h3>
        <div className="d-flex gap-2">
          <div
            className="btn btn-primary rightsidebar-button message-button"
            onClick={handleShowNewChatModal}
          >
            <HugeiconsIcon
              icon={Add01Icon}
              size={16}
              color="#ffffff"
              strokeWidth={3}
            />
            <p>New Chat</p>
          </div>
        </div>
      </div>
      <div className="messages-container">
        <div className="messages-list-container">
          <div className="messages-list-pinned">
            <h1 style={{marginBottom: "12px"}}>TEAM CHAT</h1>
            <div className="messages-pinned-list">
              {teamMessages.length > 0 ? (
                teamMessages.map((conv) => (
                  <div
                    className="messages-pinned-container"
                    key={conv.id}
                    onClick={() => handleSelectChat(conv.id, conv.receiver_id)}
                    style={{
                      backgroundColor:
                        currentConversation?.id === conv.id
                          ? "#f1f1f1"
                          : "transparent",
                    }}
                  >
                    <div className="messages-pinned">
                      <div className="messages-pinned-image" style={{backgroundColor: "#d9f9f9"}}>
                        <div className="group">
                          <HugeiconsIcon
                            icon={getConversationIcon(conv)}
                            size={12}
                            color="#4CAF50"
                            width={25}
                            height={25}
                          />
                        </div>
                      </div>
                      {conv.unread_count > 0 && (
                        <div className="unread-count-badge">{conv.unread_count}</div>
                      )}
                      <div className="message-pinned-texts">
                        <div className="message-pinned-texts-title">
                          <h1>{conv.name}</h1>
                        </div>
                        <p>
                          {conv.last_message_content?.length > 45
                            ? conv.last_message_content.slice(0, 35) + "..."
                            : conv.last_message_content}
                        </p>
                        <p className="message-time">{getLastMessageDate(conv.last_message_at)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: "10px" }}>No team chats yet.</p>
              )}
            </div>
          </div>

          <div className="messages-list-pinned message-margin">
            <h1 style={{marginBottom: "12px"}}>ALL MESSAGES</h1>
            <div className="messages-pinned-list">
              {allMessages.length > 0 ? (
                allMessages.map((conv) => (
                  <div
                    className="messages-pinned-container"
                    key={conv.id}
                    onClick={() => handleSelectChat(conv.id, conv.receiver_id)}
                    style={{
                      backgroundColor:
                        currentConversation?.id === conv.id
                          ? "#f1f1f1"
                          : "transparent",
                    }}
                  >
                    <div className="messages-pinned">
                      <div className="messages-pinned-image">
                        <img src={avatar} alt={conv.name} />
                      </div>
                      {conv.unread_count > 0 && (
                        <div className="unread-count-badge">{conv.unread_count}</div>
                      )}
                      <div className="message-pinned-texts">
                        <div className="message-pinned-texts-title">
                          <h1>{conv.name}</h1>
                        </div>
                        <p>
                          {conv.last_message_content?.length > 40
                            ? conv.last_message_content.slice(0, 35) + "..."
                            : conv.last_message_content}
                        </p>
                        <p className="message-time">{getLastMessageDate(conv.last_message_at)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: "10px" }}>No direct messages yet.</p>
              )}
            </div>
          </div>
        </div>

        {currentConversation ? (
          <div className="messages-chats">
            <div className="messages-chats-top">
              <div className="messages-pinned">
                <div className="messages-pinned-image" style={{backgroundColor: "#d9f9f9"}}>
                  {currentConversation.type === "group" ? (
                    <div className="group">
                      <HugeiconsIcon
                        icon={getConversationIcon(currentConversation)}
                        size={12}
                        color="#4CAF50"
                        width={25}
                        height={25}
                      />
                    </div>
                  ) : (
                    <img src={avatar} alt="user avatar" />
                  )}
                </div>
                <div className="message-pinned-texts">
                  <h1>{getConversationName(currentConversation)}</h1>
                  {currentConversation.type === "group" && (
                    <small className="participants-count">
                      {participants.length > 0
                        ? `${participants.length} members`
                        : "Loading members..."}
                    </small>
                  )}
                  {currentConversation.description && (
                    <p className="group-description">
                      {currentConversation.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="message-chat-top-icon">
                <HugeiconsIcon
                  icon={MoreVerticalIcon}
                  onClick={() => {
                    if (currentConversation.type === "group") {
                      setShowGroupInfoModal(true);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                />
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
                    if (message.type === "unread-header") {
                      return (
                        <div
                          key="unread-header-label"
                          className="unread-header"
                          ref={unreadHeaderRef}
                        >
                          <hr />
                          <span>Unread Messages</span>
                          <hr />
                        </div>
                      );
                    }
                    return (
                      <div
                        key={message.id}
                        className={`message-chat-user ${
                          message.user_id === user.id ? "main-user" : ""
                        }`}
                      >
                        <div className="messages-pinned">
                          <div className="messages-pinned-image">
                            <img src={avatar} alt="user avatar" />
                          </div>
                          <div className="message-pinned-texts">
                            <div className="d-flex flex-row justify-content-between align-items-center">
                              <div className="d-flex flex-row align-items-center">
                                <h1>{message.user_name}</h1>
                                <small className="message-time">
                                  {new Date(
                                    message.created_at
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </small>
                                {currentConversation.type === "group" &&
                                  message.read_count !== undefined && (
                                    <small className="read-count">
                                      {message.read_count > 0 &&
                                        `✓${message.read_count}`}
                                    </small>
                                  )}
                              </div>
                              {message.user_id === user.id && (
                                <div className="message-actions-container">
                                  <button
                                    className="more-options-btn"
                                    onClick={() => toggleMenu(message.id)}
                                  >
                                    <HugeiconsIcon
                                      icon={MoreVerticalIcon}
                                      size={16}
                                    />
                                  </button>
                                  {showMenu[message.id] && (
                                    <div className="message-actions-menu">
                                      <button
                                        onClick={() => handleEditClick(message)}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteClick(message.id)
                                        }
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <p>{message.content}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={chatBottomRef}></div>
            </div>
            <div className="messages-chats-bottom">
              <form
                onSubmit={handleSendMessage}
                className="messages-input-form"
              >
                <div className="message-chat-input">
                  <input
                    type="text"
                    placeholder={`Type a message${
                      currentConversation.type === "group"
                        ? " to the group"
                        : ""
                    }...`}
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
            <div className="placeholder-actions">
              <button
                className="btn btn-primary"
                onClick={handleShowNewChatModal}
              >
                New Direct Chat
              </button>
              
              {user?.role === "admin" && (<button
                className="btn btn-success"
                onClick={() => setShowNewGroupModal(true)}
              >
                Create Group Chat
              </button>

              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        show={showNewChatModal}
        onHide={handleCloseNewChatModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>New Direct Chat</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="chat-type-selector mb-3">
            <button
              className={`btn ${
                chatType === "direct" ? "btn-primary" : "btn-outline-primary"
              } me-2`}
              onClick={() => setChatType("direct")}
            >
              <HugeiconsIcon icon={UserIcon} size={16} className="me-1" />
              Direct Chat
            </button>
            {user?.role === "admin" && (
            <button
              className={`btn ${
                chatType === "group" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => {
                setChatType("group");
                setShowNewChatModal(false);
                setShowNewGroupModal(true);
              }}
            >
              <HugeiconsIcon icon={UserGroupIcon} size={16} className="me-1" />
              Group Chat
            </button>)}
          </div>

          {chatType === "direct" && (
            <div>
              {users.map((u) => (
                <div
                  className="messages-pinned new-chat"
                  key={u.id}
                  onClick={() => handleStartNewChat(u.id)}
                >
                  <div className="messages-pinned-image">
                    <img src={avatar} alt="user avatar" />
                  </div>
                  <div className="message-pinned-texts">
                    <h1>{u.name}</h1>
                    <p>{u.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={handleCloseNewChatModal}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showNewGroupModal}
        onHide={() => setShowNewGroupModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Create Group Chat</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="groupName" className="form-label">
              Group Name *
            </label>
            <input
              type="text"
              className="form-control"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="groupDescription" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Enter group description (optional)"
              rows="3"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Select Participants *</label>
            <div className="participants-selection">
              {users.map((u) => (
                <div
                  key={u.id}
                  className={`participant-option ${
                    selectedParticipants.includes(u.id) ? "selected" : ""
                  }`}
                  onClick={() => toggleParticipantSelection(u.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(u.id)}
                    onChange={() => {}}
                  />
                  <img
                    src={avatar}
                    alt="user avatar"
                    className="participant-avatar"
                  />
                  <span>{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowNewGroupModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedParticipants.length === 0}
          >
            Create Group
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showGroupInfoModal}
        onHide={() => setShowGroupInfoModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>{currentConversation?.name} Info</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentConversation && (
            <div>
              <div className="group-info-section">
                <h5>Description</h5>
                <p>
                  {currentConversation.description || "No description provided"}
                </p>
              </div>

              <div className="group-info-section">
                <div className="d-flex justify-content-between align-items-center">
                  <h5>Participants ({participants.length})</h5>
                  {!currentConversation.is_global && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setShowGroupInfoModal(false);
                        setShowAddParticipantsModal(true);
                      }}
                    >
                      <HugeiconsIcon
                        icon={AddTeam02FreeIcons}
                        size={14}
                        className="me-1"
                      />
                      Add
                    </button>
                  )}
                </div>

                {loadingParticipants ? (
                  <p>Loading participants...</p>
                ) : (
                  <div className="participants-list">
                    {participants.map((participant) => (
                      <div
                        key={participant.user_id}
                        className="participant-item"
                      >
                        <img
                          src={avatar}
                          alt="participant avatar"
                          className="participant-avatar"
                        />
                        <span>{participant.name}</span>
                        <small className="joined-date">
                          Joined{" "}
                          {new Date(participant.joined_at).toLocaleDateString()}
                        </small>
                        {/*!currentConversation.is_global && participant.user_id !== user.id && (
                          <button 
                            className="btn btn-sm btn-outline-danger ms-auto"
                            onClick={() => handleRemoveParticipant(participant.user_id)}
                          >
                            <HugeiconsIcon icon={Delete04Icon} size={14} />
                          </button>
                        )*/}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!currentConversation.is_global && (
                <div className="group-actions mt-3">
                  {/*<button 
                    className="btn btn-outline-warning me-2"
                    onClick={() => {
                      setShowGroupInfoModal(false);
                      setShowParticipantsModal(true);
                    }}
                  >
                    <HugeiconsIcon icon={SettingsIcon} size={16} className="me-1" />
                    Manage
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={handleLeaveGroup}
                  >
                    <HugeiconsIcon icon={LeaveIcon} size={16} className="me-1" />
                    Leave Group
                  </button>*/}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showAddParticipantsModal}
        onHide={() => setShowAddParticipantsModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Add Participants</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="participants-selection">
            {availableUsers.map((u) => (
              <div
                key={u.id}
                className={`participant-option ${
                  selectedParticipants.includes(u.id) ? "selected" : ""
                }`}
                onClick={() => toggleParticipantSelection(u.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(u.id)}
                  onChange={() => {}}
                />
                <img
                  src={avatar}
                  alt="user avatar"
                  className="participant-avatar"
                />
                <span>{u.name}</span>
              </div>
            ))}
          </div>
          {availableUsers.length === 0 && (
            <p>All users are already participants in this group.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setShowAddParticipantsModal(false);
              setSelectedParticipants([]);
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAddParticipants}
            disabled={selectedParticipants.length === 0}
          >
            Add Selected
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Messages;
