import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import "../order/order.css";
import "../messages/messages.css"
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, MoreVerticalIcon, SentIcon } from "@hugeicons/core-free-icons";
import { useNotifications } from "../../context/NotificationContext";
import avatar from "../../assets/a4.png"
import "./notification.css"

const Notification = () => {
  const { notifications, loading, error, markAsRead, fetchNotifications, page, hasMore, fetchUnreadCount } = useNotifications();
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const listContainerRef = useRef(null);

  const handleCloseNewChatModal = () => setShowNewChatModal(false);
  const handleShowNewChatModal = () => setShowNewChatModal(true);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id);
      fetchUnreadCount();
    }
  };

  const handleScroll = () => {
    if (listContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading && hasMore) {
        fetchNotifications(page + 1);
      }
    }
  };

  useEffect(() => {
      fetchNotifications();
  }, []);

  useEffect(() => {
    const container = listContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [loading, hasMore, page]);

  // Use this for the initial display, defaulting to the first notification
  useEffect(() => {
    if (notifications.length > 0 && !selectedNotification) {
      setSelectedNotification(notifications[0]);
    }
  }, [notifications, selectedNotification]);

  if (loading && notifications.length === 0) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  const reminders = notifications.filter(n => n.type === 'reminder');
  const allNotifications = notifications.filter(n => n.type !== 'reminder');

  return (
    <div className="order-page">
      <div className="rightsidebar-navbar">
        <h3>Notification</h3>
      </div>
      <div className="messages-container">
        <div className="messages-list-container" ref={listContainerRef}>
          <div className="messages-list-pinned">
            <h1>REMINDERS</h1>
            <div className="messages-pinned-list">
              {reminders.map((msg) => (
                <div 
                  className={`messages-pinned-container notification-preview ${msg.read ? 'read' : 'unread'}`} 
                  key={msg.id}
                  onClick={() => handleNotificationClick(msg)}
                >
                  <div className="messages-pinned">
                    <div className="messages-pinned-image">
                      <img src={avatar} alt={msg.title} />
                    </div>
                    <div className="message-pinned-texts notification-preview">
                      <h1>{msg.title}</h1>
                      <p>
                        {msg.message.length > 25 ? msg.message.slice(0, 25) + "..." : msg.message}
                      </p>
                    </div>
                  </div>
                  <p>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="messages-list-pinned message-margin">
            <h1>ALL NOTIFICATIONS</h1>
            <div className="messages-pinned-list">
              {allNotifications.map((msg) => (
                <div 
                  className={`messages-pinned-container ${msg.read ? 'read' : 'unread'}`} 
                  key={msg.id}
                  onClick={() => handleNotificationClick(msg)}
                >
                  <div className="messages-pinned">
                    <div className="messages-pinned-image">
                      <img src={avatar} alt={msg.title} />
                    </div>
                    <div className="message-pinned-texts">
                      <h1>{msg.title.length > 15 ? msg.title.slice(0, 15) + "..." : msg.title }</h1>
                      <p>
                        {msg.message.length > 20 ? msg.message.slice(0, 19) + "..." : msg.message}
                      </p>
                    </div>
                  </div>
                  <p>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))}
            </div>
          </div>
          {loading && <div>Loading more notifications...</div>}
          {!hasMore && notifications.length > 0 && <div>You've reached the end.</div>}
        </div>

        <div className="messages-chats">
          {selectedNotification ? (
            <>
              <div className="messages-chats-top">
                <div className="messages-pinned">
                  <div className="messages-pinned-image">
                    <img src={avatar} alt={selectedNotification.title} />
                  </div>
                  <div className="message-pinned-texts">
                    <p>{selectedNotification.title}</p>
                  </div>
                </div>
                <div className="message-chat-top-icon" onClick={handleShowNewChatModal}>
                  <HugeiconsIcon icon={MoreVerticalIcon} />
                </div>
              </div>

              <div className="messages-chat-middle">
                <div className="message-chat-date">
                  <p>{new Date(selectedNotification.created_at).toLocaleDateString()}</p>
                </div>
                <div className="notification-text">
                  <p>{selectedNotification.message}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="no-notification-selected">
              <p>Select a notification to view its content.</p>
            </div>
          )}
        </div>
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
            <h3>Assign to</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="messages-pinned new-chat">
            <div className="messages-pinned-image">
              <img src={avatar} alt="John Doe" />
            </div>
            <div className="message-pinned-texts">
              <h1>John Doe</h1>
            </div>
          </div>
          <div className="messages-pinned new-chat">
            <div className="messages-pinned-image">
              <img src={avatar} alt="Jane Doe" />
            </div>
            <div className="message-pinned-texts">
              <h1>Jane Doe</h1>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-secondary" onClick={handleCloseNewChatModal}>Done</button>
          <button className="btn-secondary" onClick={handleCloseNewChatModal}>Cancel</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notification;