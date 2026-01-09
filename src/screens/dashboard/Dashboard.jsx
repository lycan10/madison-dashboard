import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LeftSideBar from '../leftside/LeftSideBar';
import RightSideBar from '../rightside/RightSideBar';
import './dashboard.css';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeftDoubleIcon } from '@hugeicons/core-free-icons';
import { useSidebar } from '../../context/SideBarContext';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarShow, toggleSidebar } = useSidebar();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 300);

  const routeToComponentMap = {
    '/': 'Dashboard',
    '/overview': 'Overview',
    '/cables': 'Cables',
    '/hose': 'Hose',
    '/starters-alternators': 'Dashboard',
    '/orders': 'Order',
    '/price': 'Price',
    '/old-price': 'OldPrice',
    '/admin-pricing': 'AdminPricing',
    '/notifications': 'Notification',
    '/emails': 'Email',
    '/my-tasks': 'MyProject',
    '/messages': 'Messages',
    '/members': 'Member',
    '/timecard': 'TimeCard',
    '/change-password': 'ChangePassword'
  };

  const selectedLink = routeToComponentMap[location.pathname] || 'Dashboard';

  const handleNavigation = (componentName) => {
    const componentToRouteMap = {
      'Overview': '/overview',
      'Cables': '/cables',
      'Hose': '/hose',
      'Dashboard': '/starters-alternators',
      'Order': '/orders',
      'Price': '/price',
      'OldPrice': '/old-price',
      'AdminPricing': '/admin-pricing',
      'Notification': '/notifications',
      'Email': '/emails',
      'MyProject': '/my-tasks',
      'Messages': '/messages',
      'Member': '/members',
      'TimeCard': '/timecard',
      'ChangePassword': '/change-password'
    };
    
    const route = componentToRouteMap[componentName];
    
    if (route && route !== location.pathname) {
      navigate(route);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/overview', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className={`dashboard ${sidebarShow && !isMobile ? 'collapsed' : ''}`}>
      <div className={`dashboard-left ${sidebarShow ? 'show' : ''}`}>
        <LeftSideBar
          selected={selectedLink}
          onSelect={handleNavigation}
          collapsed={sidebarShow}
        />

        {!isMobile && (
          <div className="left-sidebar-filter" onClick={toggleSidebar}>
            <HugeiconsIcon
              icon={ArrowLeftDoubleIcon}
              size={20}
              color="#000000"
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>

      <div className="dashboard-right">
        <RightSideBar selected={selectedLink} />
      </div>
    </div>
  );
};

export default Dashboard;
