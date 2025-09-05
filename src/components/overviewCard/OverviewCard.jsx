import React from 'react'
import { HugeiconsIcon } from "@hugeicons/react";
import "./overviewcard.css"

const OverviewCard = ({icon, title, value, percentage}) => {
  return (
    <div className="overview-card">
    <div className="overviewcard-icon">
    <HugeiconsIcon icon={icon} color='#Ffac1f' size={16} />
    </div>
        <p>{title}</p>
        <h1>{value}</h1>
        <div className="overview-card-report">
            <p>{percentage}%</p>
            <h6>last month</h6>
        </div>

    </div>
  )
}

export default OverviewCard