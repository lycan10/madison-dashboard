import React from 'react';
import "./leftsidebar.css";
import LeftNavLinks from '../../components/leftNavLinks/LeftNavLinks';
import logo from "../../assets/black-icon.png";
import { Task02Icon, Home02Icon } from '@hugeicons/core-free-icons';
import { useSidebar } from '../../context/SideBarContext';



const LeftSideBar = ({ selected, onSelect, collapsed }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className={`leftSideBar ${collapsed ? 'collapsed' : ''}`}>
      <div className="leftSideBar-container">
        <div className="leftSideBar-logo-container">
          <div className="leftSideBar-logo">
            <img src={logo} alt="Logo" />
          </div>
          {!collapsed && (
            <div className="leftSideBar-title">
              <h1>Total Trailer</h1>
            </div>
          )}
        </div>

        <LeftNavLinks
          icon={Home02Icon}
          title="Dashboard"
          onClick={() => {
            onSelect('Dashboard');
            toggleSidebar();
          }}
          isSelected={selected === 'Dashboard'}
          collapsed={collapsed}
        />
        <LeftNavLinks
          icon={Task02Icon}
          title="Order"
          onClick={() => {
            onSelect('Order');
            toggleSidebar();
          }}
          
          isSelected={selected === 'Order'}
          collapsed={collapsed}
        />
      </div>
    </div>
  );
};

export default LeftSideBar;
