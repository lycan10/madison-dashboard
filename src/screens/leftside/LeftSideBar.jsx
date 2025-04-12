import React, {useState} from 'react';
import "./leftsidebar.css";
import LeftNavLinks from '../../components/leftNavLinks/LeftNavLinks';
import logo from "../../assets/black-icon.png"

import { Task02Icon,  Home02Icon} from '@hugeicons/core-free-icons';

const LeftSideBar = () => {
    const [selectedLink, setSelectedLink] = useState('Dashboard');

  const handleSelect = (title) => {
    setSelectedLink(title);
  };
  return (
    <div className='leftSideBar'>
        <div className="leftSideBar-container">
            <div className="leftSideBar-logo-container">
            <div className="leftSideBar-logo">
                <img src={logo} alt="" />
            </div>
            <div className="leftSideBar-title">
                <h1>Total Trailer</h1>
            </div>
            </div>
            <div className="leftSideBar-search">

            </div>
            <LeftNavLinks
  icon={Home02Icon}
  title="Dashboard"
  onClick={() => handleSelect('Dashboard')}
        isSelected={selectedLink === 'Dashboard'}
/>
<LeftNavLinks
  icon={Task02Icon}
  title="Order"
  onClick={() => handleSelect('Order')}
        isSelected={selectedLink === 'Order'}
/>
        </div>
    </div>
  )
}

export default LeftSideBar