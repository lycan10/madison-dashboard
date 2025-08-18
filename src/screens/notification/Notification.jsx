import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "../order/order.css";
import "../messages/messages.css"
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, MoreVerticalIcon, SentIcon } from "@hugeicons/core-free-icons";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import avatar from "../../assets/a4.png"
import "./notification.css"

const reminders = [
    { name: "John Larry", text: "Control cable was marked complete", time: "9:43 AM" },
    { name: "Sarah James", text: "Meeting is scheduled for tomorrow morning.", time: "10:15 AM" },
    { name: "Mike Daniels", text: "Check the latest updates on the project dashboard.", time: "11:30 AM" },
  ];

  const allNotification = [
    { name: "Mike Jones", text: "Hi bolt, please don't forget blah blah blah blah", time: "9:43 AM" },
    { name: "Sarah James", text: "Meeting is scheduled for tomorrow morning.", time: "10:15 AM" },
    { name: "Mike Daniels", text: "Check the latest updates on the project dashboard.", time: "11:30 AM" },
    { name: "Emily Carter", text: "Don’t forget to submit your timesheet today.", time: "1:05 PM" },
  ];

  

const Notification = () => {
      const [showNewChatModal, setShowNewChatModal] = useState(false);
  const {
    orderPaginationData,
    
  } = useOrders();

  const { token } = useAuth();


  const [currentPage, setCurrentPage] = useState(
    orderPaginationData.current_page || 1
  );
  const itemsPerPage = orderPaginationData.per_page || 10;

  const user = JSON.parse(localStorage.getItem("user"));

  const handleCloseNewChatModal = () => {
    setShowNewChatModal(false);
  };
  const handleShowNewChatModal = () => setShowNewChatModal(true);

  return (
    <div className="order-page">
      <div className="rightsidebar-navbar">
        <h3>Notification</h3> {/* Updated title */}

        {/* <div className="rightsidebar-button message-button"  onClick={handleShowNewChatModal}>
          <HugeiconsIcon
            icon={Add01Icon}
            size={16}
            color="#ffffff"
            strokeWidth={3}
          />
          <p>New Chat</p>
        </div> */}
      </div>
      <div className="messages-container">
        <div className="messages-list-container">
            <div className="messages-list-pinned">
                <h1>REMINDERS</h1>
                <div className="messages-pinned-list">
      {reminders.map((msg, index) => (
        <div className="messages-pinned-container notification-preview" key={index} >
          <div className="messages-pinned">
            <div className="messages-pinned-image">
              <img src={avatar} alt={msg.name} />
            </div>
            <div className="message-pinned-texts notification-preview">
              <h1>{msg.name}</h1>
              <p>
                {msg.text.length > 25 ? msg.text.slice(0, 25) + "... " + "by " + msg.name : msg.text}
              </p>
            </div>
          </div>
          <p>{msg.time}</p>
        </div>
      ))}
    </div>
            </div>
            <div className="messages-list-pinned message-margin">
                <h1>ALL NOTIFICATIONS</h1>
                <div className="messages-pinned-list">
      {allNotification.map((msg, index) => (
        <div className="messages-pinned-container" key={index}>
          <div className="messages-pinned">
            <div className="messages-pinned-image">
              <img src={avatar} alt={msg.name} />
            </div>
            <div className="message-pinned-texts">
              <h1>{msg.name}</h1>
              <p>
                {msg.text.length > 25 ? msg.text.slice(0, 25) + "..." : msg.text}
              </p>
            </div>
          </div>
          <p>{msg.time}</p>
        </div>
      ))}
    </div>
            </div>
        </div>
        <div className="messages-chats">
            <div className="messages-chats-top">
            <div className="messages-pinned">
            <div className="messages-pinned-image">
              <img src={avatar} alt="apple bees" />
            </div>
            <div className="message-pinned-texts">
              <p>John Paul</p>
              
            </div>
          </div>

          <div className="message-chat-top-icon" onClick={handleShowNewChatModal}>
          <HugeiconsIcon icon={MoreVerticalIcon} />
          </div>
            </div>

            <div className="messages-chat-middle">
                <div className="message-chat-date">
                    <p>07 August 2025.</p>
                </div>
                <div className="notification-text ">
                <p>Check the latest updates on the project dashboard. Don’t forget to submit your timesheet today</p>
                </div>
                
            </div>
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
              <img src={avatar}  />
            </div>
            <div className="message-pinned-texts">
              <h1>John Doe</h1>
             
            </div>
          </div>
          <div className="messages-pinned new-chat">
            <div className="messages-pinned-image">
              <img src={avatar}  />
            </div>
            <div className="message-pinned-texts">
              <h1>John Doe</h1>
             
            </div>
    
          </div>
          
        </Modal.Body>
        <Modal.Footer>
        <button className="btn-secondary" onClick={handleCloseNewChatModal}>
            Done
          </button>
          <button className="btn-secondary" onClick={handleCloseNewChatModal}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Notification;
