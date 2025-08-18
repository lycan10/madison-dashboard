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
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import avatar from "../../assets/a4.png";

const teamMessages = [
  {
    name: "John Larry",
    text: "Hi bolt, please don't forget blah blah blah blah",
    time: "9:43 AM",
  },
];

const allMessages = [
  {
    name: "John Larry",
    text: "Hi bolt, please don't forget blah blah blah blah",
    time: "9:43 AM",
  },
  {
    name: "Sarah James",
    text: "Meeting is scheduled for tomorrow morning.",
    time: "10:15 AM",
  },
  {
    name: "Mike Daniels",
    text: "Check the latest updates on the project dashboard.",
    time: "11:30 AM",
  },
  {
    name: "Sarah James",
    text: "Meeting is scheduled for tomorrow morning.",
    time: "10:15 AM",
  },
  {
    name: "Mike Daniels",
    text: "Check the latest updates on the project dashboard.",
    time: "11:30 AM",
  },
];

const allMembers = [
  { name: "Mike Jones", status: "online" },
  { name: "Sarah James", status: "offline" },
  { name: "Mike Daniels", status: "online" },
  { name: "Emily Carter", status: "offline" },
];

const teamConversation = {
  id: "team",
  title: "Team Chat",
  participants: ["John Paul", "Team"],
  messages: [
    {
      id: 1,
      from: "John Paul",
      text: "Standup in 10 minutes",
      time: "9:00 AM",
    },
    {
      id: 2,
      from: "Emily Carter",
      text: "Got it — joining now",
      time: "9:02 AM",
    },
    { id: 3, from: "Mike Daniels", text: "Already on it", time: "9:05 AM" },
  ],
};

const Messages = () => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(teamConversation);
  const [selected, setSelected] = useState("team");

  const chatBottomRef = useRef(null);

  const handleLinkClick = (chatType) => {
    setSelected(chatType);
  };

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat]);

  const { orderPaginationData } = useOrders();

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
        <h3>Messages</h3> {/* Updated title */}
        {/* <div
          className="rightsidebar-button message-button"
          onClick={handleShowNewChatModal}
        >
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
            <h1>TEAM CHAT</h1>
            <div className="messages-pinned-list">
              {teamMessages.map((msg, index) => (
                <div
                  className="messages-pinned-container"
                  key={index}
                  onClick={() => handleLinkClick("team")}
                >
                  <div className="messages-pinned">
                    <div className="messages-pinned-image">
                      <img src={avatar} alt={msg.name} />
                    </div>
                    <div className="message-pinned-texts">
                      <div className="message-pinned-texts-title">
                        <h1>{msg.name}</h1>
                        <p>{msg.time}</p>
                      </div>

                      <p>
                        {msg.text.length > 45
                          ? msg.text.slice(0, 35) + "..."
                          : msg.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="messages-list-pinned message-margin">
            <h1>ALL MESSAGES</h1>
            <div className="messages-pinned-list">
              {allMessages.map((msg, index) => (
                <div className="messages-pinned-container" key={index}        
                onClick={() => setSelected("direct")}>
                   <div className="messages-pinned">
                    <div className="messages-pinned-image">
                      <img src={avatar} alt={msg.name} />
                    </div>
                    <div className="message-pinned-texts">
                      <div className="message-pinned-texts-title">
                        <h1>{msg.name}</h1>
                        <p>{msg.time}</p>
                      </div>

                      <p>
                        {msg.text.length > 40
                          ? msg.text.slice(0, 35) + "..."
                          : msg.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="messages-list-pinned message-margin">
            <h1>ALL MEMBERS</h1>
            <div className="messages-pinned-list">
              {allMembers.map((msg, index) => (
                <div className="messages-pinned-container" key={index} 
                onClick={() => setSelected("new")}>
                   <div className="messages-pinned" >
                    <div className="messages-pinned-image">
                      <img src={avatar} alt={msg.name} />
                    </div>
                    <div className="message-pinned-texts">
                      <div className="message-pinned-texts-title">
                        <h1>{msg.name}</h1>
                      </div>

                      <p>
                        {msg.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {selected === "direct" && (
          <div className="messages-chats">
            <div className="messages-chats-top">
              <div className="messages-pinned">
                <div className="messages-pinned-image">
                  <img src={avatar} alt="apple bees" />
                </div>
                <div className="message-pinned-texts">
                  <h1>John Paul</h1>
                  <p style={{ color: "red" }}>John Jones is typing...</p>
                </div>
              </div>

              <div className="message-chat-top-icon">
                <HugeiconsIcon icon={MoreVerticalIcon} />
              </div>
            </div>

            <div className="messages-chat-middle">
              <div className="message-chat-date">
                <p>07 August 2025.</p>
              </div>
              <div className="message-chat-user ">
                <p>
                  Check the latest updates on the project dashboard. Don’t
                  forget to submit your timesheet today
                </p>
              </div>
              <div className="message-chat-user main-user">
                <p>Hi bolt, please don't forget blah blah blah blah</p>
              </div>
            </div>
            <div className="messages-chats-bottom">
              <div className="message-chat-input">
                <input type="text" placeholder="Type a message..." />
              </div>

              <div className="message-chat-bottom-icon">
                <HugeiconsIcon icon={SentIcon} size={16} />
              </div>
            </div>
          </div>
        )}

        {selected === "team" && (
          <div className="messages-chats">
            <div className="messages-chats-top">
              <div className="messages-pinned">
                <div className="messages-pinned-image">
                  <img src={avatar} alt="apple bees" />
                </div>
                <div className="message-pinned-texts">
                  <h1>Cable Crushers</h1>
                  <p style={{ color: "red" }}>John Jones is typing...</p>
                </div>
              </div>

              <div className="message-chat-top-icon">
                <HugeiconsIcon icon={MoreVerticalIcon} />
              </div>
            </div>

            <div className="messages-chat-middle">
              <div className="message-chat-date">
                <p>07 August 2025.</p>
              </div>
              <div className="message-chat-user group-chat ">
                <div className="messages-pinned">
                  <div className="messages-pinned-image">
                    <img src={avatar} alt="apple bees" />
                  </div>
                  <div className="message-pinned-texts ">
                    <h1>John Paul</h1>
                    <p>John Jones is typing are you blah blah blah</p>
                  </div>
                </div>
              </div>
              <div className="message-chat-user group-chat ">
                <div className="messages-pinned">
                  <div className="messages-pinned-image">
                    <img src={avatar} alt="apple bees" />
                  </div>
                  <div className="message-pinned-texts ">
                    <h1>Jimmy Johns</h1>
                    <p>John Jones is typing are you blah blah blah</p>
                  </div>
                </div>
              </div>
              <div className="message-chat-user group-chat main-user ">
                <div className="messages-pinned group-chat-user">
                  <div className="messages-pinned-image">
                    <img src={avatar} alt="apple bees" />
                  </div>
                  <div className="message-pinned-texts group-chat-flex">
                    <h1>You</h1>
                    <p>Lets get that Cable money....</p>
                  </div>
                </div>
              </div>
              <div className="message-chat-user group-chat ">
                <div className="messages-pinned">
                  <div className="messages-pinned-image">
                    <img src={avatar} alt="apple bees" />
                  </div>
                  <div className="message-pinned-texts ">
                    <h1>Jimmy Johns</h1>
                    <p>John Jones is typing are you blah blah blah</p>
                  </div>
                </div>
              </div>
              <div className="message-chat-user group-chat main-user ">
                <div className="messages-pinned group-chat-user">
                  <div className="messages-pinned-image">
                    <img src={avatar} alt="apple bees" />
                  </div>
                  <div className="message-pinned-texts group-chat-flex">
                    <h1>You</h1>
                    <p>Lets get that Cable money....</p>
                  </div>
                </div>
              </div>
              <div className="message-chat-user group-chat ">
                <div className="messages-pinned">
                  <div className="messages-pinned-image">
                    <img src={avatar} alt="apple bees" />
                  </div>
                  <div className="message-pinned-texts ">
                    <h1>Jimmy Johns</h1>
                    <p>John Jones is typing are you blah blah blah</p>
                  </div>
                </div>
              </div>
              <div className="message-chat-user group-chat main-user ">
                <div className="messages-pinned group-chat-user">
                  <div className="messages-pinned-image">
                    <img src={avatar} alt="apple bees" />
                  </div>
                  <div className="message-pinned-texts group-chat-flex">
                    <h1>You</h1>
                    <p>Lets get that Cable money....</p>
                  </div>
                </div>
              </div>
              <div className="message-chat-user group-chat main ">
                <div className="messages-pinned">
                  <div className="messages-pinned-image">
                    <img src={avatar} alt="apple bees" />
                  </div>
                  <div className="message-pinned-texts ">
                    <h1>Bill Xander</h1>
                    <p>Lets get that Cable money....</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="messages-chats-bottom">
              <div className="message-chat-input">
                <input type="text" placeholder="Type a message..." />
              </div>

              <div className="message-chat-bottom-icon">
                <HugeiconsIcon icon={SentIcon} size={16} />
              </div>
            </div>
          </div>
        )}
           {selected === "new" && (
          <div className="messages-chats">
            <div className="messages-chats-top">
              <div className="messages-pinned">
                <div className="messages-pinned-image">
                  <img src={avatar} alt="apple bees" />
                </div>
                <div className="message-pinned-texts">
                  <h1>New Chat</h1>
                  <p style={{ color: "red" }}>John Jones is typing...</p>
                </div>
              </div>

              <div className="message-chat-top-icon">
                <HugeiconsIcon icon={MoreVerticalIcon} />
              </div>
            </div>

            <div className="messages-chat-middle">
              <div className="message-chat-date">
                <p>07 August 2025.</p>
              </div>
              <div className="new-message-chat">
                new message place holder
              </div>
            </div>

            <div className="messages-chats-bottom">
              <div className="message-chat-input">
                <input type="text" placeholder="Type a message..." />
              </div>

              <div className="message-chat-bottom-icon">
                <HugeiconsIcon icon={SentIcon} size={16} />
              </div>
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
            <h3>New Chat</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="messages-pinned new-chat">
            <div className="messages-pinned-image">
              <img src={avatar} />
            </div>
            <div className="message-pinned-texts">
              <h1>John Doe</h1>
            </div>
          </div>
          <div className="messages-pinned new-chat">
            <div className="messages-pinned-image">
              <img src={avatar} />
            </div>
            <div className="message-pinned-texts">
              <h1>John Doe</h1>
            </div>
          </div>
          <div className="messages-pinned new-chat">
            <div className="messages-pinned-image">
              <img src={avatar} />
            </div>
            <div className="message-pinned-texts">
              <h1>John Doe</h1>
            </div>
          </div>
          <div className="messages-pinned new-chat">
            <div className="messages-pinned-image">
              <img src={avatar} />
            </div>
            <div className="message-pinned-texts">
              <h1>John Doe</h1>
            </div>
          </div>
          <div className="messages-pinned new-chat">
            <div className="messages-pinned-image">
              <img src={avatar} />
            </div>
            <div className="message-pinned-texts">
              <h1>John Doe</h1>
            </div>
          </div>
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
