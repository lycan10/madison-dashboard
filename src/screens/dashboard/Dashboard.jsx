import React, { useState } from 'react'
import LeftSideBar from '../leftside/LeftSideBar'
import RightSideBar from '../rightside/RightSideBar'
import "./dashboard.css"

const Dashboard = () => {
  const [selectedLink, setSelectedLink] = useState('Dashboard');

  return (
    <div className='dashboard'>
        <div className="dashboard-left">
            <LeftSideBar selected={selectedLink} onSelect={setSelectedLink} />
        </div>
        <div className="dashboard-right">
            <RightSideBar selected={selectedLink} />
        </div>
    </div>
  )
}

export default Dashboard;
