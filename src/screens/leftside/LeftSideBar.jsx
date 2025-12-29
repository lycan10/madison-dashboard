import React, { useEffect, useState } from "react";
import "./leftsidebar.css";
import LeftNavLinks from "../../components/leftNavLinks/LeftNavLinks";
import logo from "../../assets/Icon-yellow.png";
import {
  Task02Icon,
  Home02Icon,
  DashboardSquare01Icon,
  CheckListIcon,
  Notification01Icon,
  UserMultipleIcon, 
  CalendarAdd01FreeIcons,
  LogoutIcon,
  MessageMultiple01Icon,
  Tag01FreeIcons,
  TractorFreeIcons,
  WaterEnergyFreeIcons,
  Notification01FreeIcons,
  Note02Icon,
  Mail01Icon,
  ReceiptDollarIcon
} from "@hugeicons/core-free-icons";
import { useSidebar } from "../../context/SideBarContext";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../context/MessageContext";
import { useNotifications } from "../../context/NotificationContext";

const LeftSideBar = ({ selected, onSelect, collapsed }) => {
  const { toggleSidebar } = useSidebar();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 300);
  const { user, logout } = useAuth();
  const { fetchConversations, totalUnreadCount } = useMessages();
  const { unreadCount, fetchUnreadCount } = useNotifications();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 300);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLinkClick = (linkTitle) => {
    console.log('LeftSideBar: handleLinkClick called with:', linkTitle);
    onSelect(linkTitle);
    if (isMobile) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => {
        fetchConversations();
        fetchUnreadCount()
      },
      60000
    );
    return () => clearInterval(interval);
      
  }, [fetchConversations, fetchUnreadCount]);

  console.log(totalUnreadCount);

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const navigationItems = [
    {
      icon: DashboardSquare01Icon,
      title: "Overview",
      componentName: "Overview"
    },
    {
      icon: TractorFreeIcons,
      title: "Cables",
      componentName: "Cables"
    },
    {
      icon: WaterEnergyFreeIcons,
      title: "Hydraulic Hose",
      componentName: "Hose"
    },
    {
      icon: Tag01FreeIcons,
      title: "Starters/Alternators",
      componentName: "Dashboard"
    },
    {
      icon: ReceiptDollarIcon,
      title: "Price",
      componentName: "Price"
    },
    {
      icon: Task02Icon,
      title: "Order",
      componentName: "Order"
    }
  ];

  const communicationItems = [
    {
      icon: Notification01FreeIcons,
      title: "Notification",
      componentName: "Notification",
      badgeCount: unreadCount
    },
    {
      icon: Mail01Icon,
      title: "Emails",
      componentName: "Email"
    },
    {
      icon: Note02Icon,
      title: "My Tasks",
      componentName: "MyProject"
    },
    {
      icon: MessageMultiple01Icon,
      title: "Messages",
      componentName: "Messages",
      badgeCount: totalUnreadCount
    },
    {
      icon: UserMultipleIcon,
      title: "Members",
      componentName: "Member"
    }
  ];

  return (
    <div className={`leftSideBar ${collapsed ? "collapsed" : ""}`}>
      <div className="leftSideBar-container">
        <div className="leftSideBar-logo-container">
          <div className="leftSideBar-logo">
            <img
              src={logo || "https://placehold.co/25x25/000000/FFFFFF?text=Logo"}
              alt="Logo"
            />
          </div>
          {!collapsed && (
            <div className="leftSideBar-title">
              <h1>Madison Generator</h1>
            </div>
          )}
        </div> 

        {navigationItems.map((item) => (
          <LeftNavLinks
            key={item.componentName}
            icon={item.icon}
            title={item.title}
            onClick={() => handleLinkClick(item.componentName)}
            isSelected={selected === item.componentName}
            collapsed={collapsed}
            badgeCount={item.badgeCount}
          />
        ))}

        <div className="vertical-dash"></div>

        {communicationItems.map((item) => (
          <LeftNavLinks
            key={item.componentName}
            icon={item.icon}
            title={item.title}
            onClick={() => handleLinkClick(item.componentName)}
            isSelected={selected === item.componentName}
            collapsed={collapsed}
            badgeCount={item.badgeCount}
          />
        ))}

        <div className="vertical-dash"></div>

        <LeftNavLinks
          icon={CalendarAdd01FreeIcons}
          title="Time Card"
          onClick={() => handleLinkClick("TimeCard")}
          isSelected={selected === "TimeCard"}
          collapsed={collapsed}
        />

        {user?.name === "admin" && (
          <LeftNavLinks
            icon={CalendarAdd01FreeIcons}
            title="Change Password"
            onClick={() => handleLinkClick("ChangePassword")}
            isSelected={selected === "ChangePassword"}
            collapsed={collapsed}
          />
        )}

        <LeftNavLinks
          icon={LogoutIcon}
          title="Logout"
          onClick={() => handleLogout()}
          collapsed={collapsed}
        />
      </div>
    </div>
  );
};

export default LeftSideBar;
