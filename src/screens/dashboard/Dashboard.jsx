import React from 'react'
import LeftSideBar from '../leftside/LeftSideBar'
import RightSideBar from '../rightside/RightSideBar'
import "./dashboard.css"

const Dashboard = () => {
  return (
    <div className='dashboard'>
        <div className="dashboard-left">
            <LeftSideBar />
        </div>
        <div className="dashboard-right">
            <RightSideBar />
        </div>
    </div>
  )
}

export default Dashboard