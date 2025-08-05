import React, { useEffect, useState } from "react";
import "./leftsidebar.css";
import LeftNavLinks from "../../components/leftNavLinks/LeftNavLinks";
import logo from "../../assets/black-icon.png";
import {
  Task02Icon,
  Home02Icon,
  CheckListIcon,
  Car02FreeIcons,
  CalendarAdd01FreeIcons,
  LogoutIcon,
  Tag01FreeIcons,
  TractorFreeIcons,
  WaterEnergyFreeIcons,
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
