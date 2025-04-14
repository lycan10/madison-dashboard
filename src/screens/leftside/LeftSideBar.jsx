import React, {useState} from 'react';
import "./leftsidebar.css";
import LeftNavLinks from '../../components/leftNavLinks/LeftNavLinks';
import logo from "../../assets/black-icon.png"

import { Task02Icon,  Home02Icon} from '@hugeicons/core-free-icons';

const LeftSideBar = ({ selected, onSelect }) => {
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

            <LeftNavLinks
              icon={Home02Icon}
              title="Dashboard"
              onClick={() => onSelect('Dashboard')}
              isSelected={selected === 'Dashboard'}
            />
            <LeftNavLinks
              icon={Task02Icon}
              title="Order"
              onClick={() => onSelect('Order')}
              isSelected={selected === 'Order'}
            />
        </div>
    </div>
  );
}


export default LeftSideBar