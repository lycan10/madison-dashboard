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
} from "@hugeicons/core-free-icons";
import { useSidebar } from "../../context/SideBarContext";
import { useAuth } from "../../context/AuthContext";

const LeftSideBar = ({ selected, onSelect, collapsed }) => {
  const { toggleSidebar } = useSidebar();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 300);
  const { user, logout } = useAuth();

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
    onSelect(linkTitle);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

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
        <LeftNavLinks
          icon={DashboardSquare01Icon}
          title="Overview"
          onClick={() => handleLinkClick("Overview")}
          isSelected={selected === "Overview"}
          collapsed={collapsed}
        />
        <LeftNavLinks
          icon={TractorFreeIcons}
          title="Cables"
          onClick={() => handleLinkClick("Cables")}
          isSelected={selected === "Cables"}
          collapsed={collapsed}
        />
        <LeftNavLinks
          icon={WaterEnergyFreeIcons}
          title="Hydraulic Hose"
          onClick={() => handleLinkClick("Hose")}
          isSelected={selected === "Hose"}
          collapsed={collapsed}
        />
        <LeftNavLinks
          icon={Tag01FreeIcons}
          title="Starters/Alternators"
          onClick={() => handleLinkClick("Dashboard")}
          isSelected={selected === "Dashboard"}
          collapsed={collapsed}
        />
        <LeftNavLinks
          icon={Task02Icon}
          title="Order"
          onClick={() => handleLinkClick("Order")}
          isSelected={selected === "Order"}
          collapsed={collapsed}
        />
        <div className="vertical-dash"></div>
        <LeftNavLinks
          icon={Notification01FreeIcons} 
          title="Notification"
          onClick={() => handleLinkClick("Notification")}
          isSelected={selected === "Notification"}
          collapsed={collapsed}
        />
         <LeftNavLinks
          icon={Mail01Icon} 
          title="Emails"
          onClick={() => handleLinkClick("Email")}
          isSelected={selected === "Email"}
          collapsed={collapsed}
        />
      
         <LeftNavLinks
          icon={Note02Icon} 
          title="My Tasks"
          onClick={() => handleLinkClick("MyProject")}
          isSelected={selected === "MyProject"}
          collapsed={collapsed}
        />
         <LeftNavLinks
          icon={MessageMultiple01Icon} 
          title="Messages"
          onClick={() => handleLinkClick("Messages")}
          isSelected={selected === "Messages"}
          collapsed={collapsed}
        />
       
          <LeftNavLinks
          icon={UserMultipleIcon}
          title="Members"
          onClick={() => handleLinkClick("Member")}
          isSelected={selected === "Member"}
          collapsed={collapsed}
        />
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
