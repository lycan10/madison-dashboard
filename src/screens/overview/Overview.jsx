import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "../order/order.css";
import "../overview/overview.css";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Search01Icon,
  FireIcon,
  ZapIcon,
  Coffee02Icon,
  Tag01FreeIcons,
  WaterEnergyFreeIcons,
  TractorFreeIcons,
} from "@hugeicons/core-free-icons";
import ProgressFilter from "../../components/progressfilter/ProgressFilter";
import Pagination from "react-bootstrap/Pagination";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import Priority from "../../components/priority/Priority";
import OverviewCard from "../../components/overviewCard/OverviewCard";
import { PieChart } from "react-minimal-pie-chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const getStatusStyles = (status) => {
  switch (status) {
    case "Not Task":
      return { color: "#FFA500", bgColor: "#FFF7E6" }; // Orange
    case "In Progress":
      return { color: "#007BFF", bgColor: "#E6F2FF" }; // Blue
    case "Pending Review":
      return { color: "#17A2B8", bgColor: "#E0F7FA" }; // Teal
    case "On Hold":
      return { color: "#28A745", bgColor: "#E8F6EA" }; // Green
    case "Completed":
      return { color: "#20C997", bgColor: "#E6FFFA" }; // Light Green
    case "Cancelled":
      return { color: "#DC3545", bgColor: "#FDEAEA" }; // Red
    case "Overdue":
      return { color: "#6F42C1", bgColor: "#F3E8FF" }; // Purple
    default:
      return { color: "#6C757D", bgColor: "#F8F9FA" }; // Gray
  }
};

const getPriorityStyles = (priority) => {
  switch (priority) {
    case "High":
      return { color: "red", bgColor: "#FFF2F2", icon: FireIcon };
    case "Medium":
      return { color: "orange", bgColor: "lightyellow", icon: ZapIcon };
    case "Low":
      return { color: "green", bgColor: "#EAFAEA", icon: Coffee02Icon };
    default:
      return { color: "black", bgColor: "white" };
  }
};

const Overview = () => {
  const {
    orderPaginationData,
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    updateOrder,
    deleteOrder,
  } = useOrders();

  const { token } = useAuth();

  const [currentPage, setCurrentPage] = useState(
    orderPaginationData.current_page || 1
  );
  const itemsPerPage = orderPaginationData.per_page || 10;

  const [selectedStatus, setSelectedStatus] = useState("All");
  const statuses = [
    "All",
    "New Task",
    "In Progress",
    "Pending Review",
    "On Hold",
    "Completed",
    "Cancelled",
    "Overdue",
  ];
  const user = JSON.parse(localStorage.getItem("user"));

  const [orderCounts, setOrderCounts] = useState({
    All: 0,
    "New Task": 0,
    "In Progress": 0,
    "Pending Review": 0,
    "On Hold": 0,
    Completed: 0,
    Cancelled: 0,
    Overdue: 0,
  });





  const taskOverviewData = [
    { title: "New tasks", value: 85 },
    { title: "Tasks in progress", value: 190 },
    { title: "Overdue tasks", value: 32 },
    { title: "Completed tasks", value: 213 },
    { title: "Pending review", value: 45 },
    { title: "On hold", value: 28 },
    { title: "Cancelled", value: 17 },
  ];

  const cableData = [
    { title: "New tasks", value: 10, color: "#FF4C4C" },   // bright red
    { title: "In progress", value: 20, color: "#36CFC9" }, // bright aqua
    { title: "Cancelled", value: 25, color: "#6C63FF" },   // vivid indigo
    { title: "Awaiting parts", value: 30, color: "#FFD93D" }, // bright yellow
    { title: "Picked up", value: 35, color: "#FF6F91" },   // hot pink
    { title: "Shipped", value: 15, color: "#FF914D" },     // bright orange
  ];
  
  const HoseData = [
    { title: "New tasks", value: 12, color: "#FF6B35" },   // tangerine
    { title: "In progress", value: 18, color: "#00C49A" }, // vivid teal
    { title: "Cancelled", value: 8, color: "#845EC2" },    // lively purple
    { title: "Awaiting parts", value: 22, color: "#FFC75F" }, // bright amber
    { title: "Picked up", value: 28, color: "#FF9671" },   // coral
    { title: "Shipped", value: 10, color: "#F9F871" },     // neon yellow-green
  ];
  
  const starterData = [
    { title: "New tasks", value: 15, color: "#FF595E" },   // bright coral red
    { title: "In progress", value: 25, color: "#8AC926" }, // lime green
    { title: "Cancelled", value: 12, color: "#1982C4" },   // strong blue
    { title: "Awaiting parts", value: 20, color: "#FFCA3A" }, // sunflower yellow
    { title: "Picked up", value: 18, color: "#6A4C93" },   // bold violet
    { title: "Shipped", value: 10, color: "#FF7B00" },     // bright orange
  ];
  

  const total = cableData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="order-page">
      <div className="rightsidebar-navbar">
        <h3>Overview</h3> {/* Updated title */}
      </div>

      {/* Order Table */}
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div className="order-table-container" s>
          <div className="overview-card-main-container">
            <div className="overview-cable-container">
              <OverviewCard
                icon={TractorFreeIcons}
                title={"cables"}
                value={34000}
                percentage={"+0.5"}
              />
              <OverviewCard
                icon={WaterEnergyFreeIcons}
                title={"Hydraulic Hose"}
                value={34000}
                percentage={"+0.5"}
              />
              <OverviewCard
                icon={Tag01FreeIcons}
                title={"Starters/Alternators"}
                value={34000}
                percentage={"+0.5"}
              />
              <OverviewCard
                icon={FireIcon}
                title={"All"}
                value={34000}
                percentage={"+0.5"}
              />
            </div>

            {/* pie chart of each  */}
            <div className="overview-piechart">
              <div className="piechart-cable">
                <h1>Cables</h1>
                <div className="piechart-circle">
                  <PieChart
                    data={cableData}
                    // // Hover effect (tooltip)
                    // segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
                    // segmentsShift={(index) => (index === 0 ? 2 : 0.5)}
                    animate
                    label={({ dataEntry }) =>
                      `${Math.round((dataEntry.value / total) * 100)}%`
                    }
                    labelStyle={{
                      fontSize: "5px",
                      fontFamily: "sans-serif",
                      fill: "#fff",
                    }}
                    labelPosition={70}
                  />
                  {/* Total in middle */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "black",
                      padding: "0.75rem",
                      backgroundColor:"white",
                      borderRadius: "100%"
                    }}
                  >
                    {total}
                    <br />
                    Total
                  </div>
                </div>
              </div>
              <div className="piechart-cable">
                <h1>Hydraulic Hose</h1>
                <div className="piechart-circle">
                  <PieChart
                    data={HoseData}
                    // // Hover effect (tooltip)
                    // segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
                    // segmentsShift={(index) => (index === 0 ? 2 : 0.5)}
                    animate
                    label={({ dataEntry }) =>
                      `${Math.round((dataEntry.value / total) * 100)}%`
                    }
                    labelStyle={{
                      fontSize: "5px",
                      fontFamily: "sans-serif",
                      fill: "#fff",
                    }}
                    labelPosition={70}
                  />
                  {/* Total in middle */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "black",
                      padding: "0.75rem",
                      backgroundColor:"white",
                      borderRadius: "100%"
                    }}
                  >
                    {total}
                    <br />
                    Total
                  </div>
                </div>
              </div>
              <div className="piechart-cable">
                <h1>Starter/Alternators</h1>
                <div className="piechart-circle">
                  <PieChart
                    data={starterData}
                    // Hover effect (tooltip)
                    // segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
                    // segmentsShift={(index) => (index === 0 ? 2 : 0.5)}
                    animate
                    label={({ dataEntry }) =>
                      `${Math.round((dataEntry.value / total) * 100)}%`
                    }
                    labelStyle={{
                      fontSize: "5px",
                      fontFamily: "sans-serif",
                      fill: "#fff",
                    }}
                    labelPosition={70}
                  />
                  {/* Total in middle */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "black",
                      padding: "0.75rem",
                      backgroundColor:"white",
                      borderRadius: "100%"
                    }}
                  >
                    {total}
                    <br />
                    Total
                  </div>
                </div>
              </div>
            </div>

            {/* Line graph */}
            <div className="bar-graph" style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <BarChart
                  data={taskOverviewData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#Ffac1f" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Overview;
