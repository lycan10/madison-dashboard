import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../order/order.css";
import "./timecard.css"
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Download04FreeIcons,
  Search01Icon,
  CalendarAdd02FreeIcons,
  Coffee02FreeIcons
} from "@hugeicons/core-free-icons";
import ProgressFilter from "../../components/progressfilter/ProgressFilter";
import Pagination from "react-bootstrap/Pagination";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";

const getStatusStyles = (status) => {
  switch (status) {
    case "All":
      return { color: "#FFA500", bgColor: "#FFF5E6" };
    case "Active":
      return { color: "#007BFF", bgColor: "#E6F0FF" };
    case "Vacation":
      return { color: "#17A2B8", bgColor: "#E0F7FA" };
    case "Holiday":
      return { color: "#28a745", bgColor: "#E8F6EA" };
    case "Inactive":
      return { color: "#20c997", bgColor: "#E6FFFA" };
      case "Sick leave":
      return { color: "#6c757d", bgColor: "#f8f9fa" };
    default:
      return { color: "#6c757d", bgColor: "#f8f9fa" };
  }
};

const TimeCard = () => {
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
    "Active",
    "Vacation",
    "Holiday",
    "Inactive",
    "Sick leave",
  ];

  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [clockToggle, setClockToggle] = useState(false);
  const [breakToggle, setBreakToggle] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const [orderCounts, setOrderCounts] = useState({
    All: 0,
   "Active": 0,
    "Holiday": 0,
    "Vacation": 0,
    "Inactive": 0,
    "Sick leave" : 0
  });

  const [orderFormData, setOrderFormData] = useState({
    partName: "",
    quantity: 1,
    vendor: "",
    status: "Inactive",
    comments: "",
  });

  const [editingOrder, setEditingOrder] = useState(null);

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    setSelectedItem({});
  };
  const handleShowInfoModal = () => setShowInfoModal(true);

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetOrderFormData();
  };
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingOrder(null);
    resetOrderFormData();
  };
  const handleShowEditModal = () => setShowEditModal(true);

  const resetOrderFormData = () => {
    setOrderFormData({
      partName: "",
      quantity: 1,
      vendor: "",
      status: "Inactive",
      comments: "",
    });
  };

  const handleFilterClick = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderFormData((prev) => ({ ...prev, [name]: value }));
  };

  const increaseQuantity = () => {
    setOrderFormData((prevData) => ({
      ...prevData,
      quantity: prevData.quantity + 1,
    }));
  };

  const decreaseQuantity = () => {
    if (orderFormData.quantity > 1) {
      setOrderFormData((prevData) => ({
        ...prevData,
        quantity: prevData.quantity - 1,
      }));
    }
  };

  const handleAddSubmit = async () => {
    const success = await addOrder({
      ...orderFormData,
      comments: orderFormData.comments,
    });
    if (success) {
      handleCloseAddModal();
      fetchStatusCounts();
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setOrderFormData({
      partName: order.partName || "",
      quantity: order.quantity || 1,
      vendor: order.vendor || "",
      status: order.status || "Inactive",
      comments: order.comments || "",
    });
    handleShowEditModal();
  };

  const handleEditSubmit = async () => {
    if (!editingOrder) return;

    const success = await updateOrder(editingOrder.id, {
      ...orderFormData,
      comments: orderFormData.comments,
    });
    if (success) {
      handleCloseEditModal();
      fetchStatusCounts();
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteOrder(id);
    if (success) {
      console.log(`Order with ID ${id} deleted successfully.`);
      fetchStatusCounts();
    }
  };

  const displayedOrders = orders;
  const totalPages = orderPaginationData.last_page || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortClick = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClockToggle = (e) => {
    setClockToggle(prev => !prev)
  }
  const handleBreakToggle = () => {
    setBreakToggle(prev => !prev);
  };

  const fetchStatusCounts = async () => {
    try {
      const API_URL = `${process.env.REACT_APP_BASE_URL}/api/orders/counts`;

      const response = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrderCounts(data);
    } catch (error) {
      console.error("Error fetching status counts:", error);
    }
  };

  useEffect(() => {
    const params = {
      page: currentPage,
      perPage: itemsPerPage,
      ...(selectedStatus !== "All" && { status: selectedStatus }),
      sortBy: sortBy,
      sortDirection: sortDirection,
      ...(searchTerm && { search: searchTerm }),
    };
    fetchOrders(params);
  }, [
    selectedStatus,
    sortBy,
    sortDirection,
    currentPage,
    itemsPerPage,
    fetchOrders,
    searchTerm,
  ]);

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    if (
      orderPaginationData.current_page &&
      orderPaginationData.current_page !== currentPage
    ) {
      setCurrentPage(orderPaginationData.current_page);
    }
  }, [orderPaginationData.current_page]);

  const countByStatus = (status) => {
    return orderCounts[status] || 0;
  };

  const promptDeleteConfirmation = (order) => {
    setOrderToDelete(order);
    setShowDeleteConfirmModal(true);
  };

  const handleDownload = (type) => {
    console.log(`Downloading as ${type}`);
    // Handle the actual download here
    setShowDownloadModal(false);
  };

  return (
    <div className="order-page">
      <div className="rightsidebar-navbar">
        <h3>Total Trailer</h3> {/* Updated title */}
        <div className="timesheet-container">
        <div className="timesheet-button break-btn" onClick={handleBreakToggle}>
          <HugeiconsIcon
            icon={Coffee02FreeIcons}
            size={15}
            color="#3c58ae"
            strokeWidth={1.5}
          />
          <p>
  {breakToggle ? "Stop Break" : "Start Break"}
</p>

        </div>
        <div className="timesheet-button" onClick={handleClockToggle}>
          <HugeiconsIcon
            icon={CalendarAdd02FreeIcons}
            size={15}
            color="#ffffff"
            strokeWidth={1.5}
          />
            <p>
            {clockToggle ? "Clock in" : "Clock out"}
            </p>
        </div>
        </div>

      </div>

      <div className="order-page-title">
        <h3> TimeSheet </h3>
      </div>

    

      {/* Search Input */}
      <div className="download-container">
      <div className="search-input-container select-container">
  <select
    value={searchTerm}
    onChange={null}
    className="search-input"
  >
    <option value="">Select name...</option>
    <option value="Active">Andrew</option>
    <option value="Holiday">Matt</option>
  </select>
        </div>
        <div className="search-input-container select-container">
  <select
    value={searchTerm}
    onChange={(e) => e.target.value}
    className="search-input"
  >
    <option value="">Select status...</option>
    <option value="Active">All</option>
    <option value="Active">Active</option>
    <option value="Holiday">Holiday</option>
    <option value="Vacation">Vacation</option>
    <option value="InActive">InActive</option>
  </select>
        </div>
        <div
          className="rightsidebar-button"
          style={{ backgroundColor: "#3c58ae" }}
          onClick={() => setShowDownloadModal(true)}
        >
          <HugeiconsIcon
            icon={Download04FreeIcons}
            size={16}
            color="#ffffff"
            strokeWidth={2}
          />
          <p>Download</p>
        </div>
      </div>

      <div className="timesheet-timer-container">
        <div className="timesheet-timer">
            <p>Clock In</p>
            <h1>9:00 AM</h1>
        </div>
        <div className="timesheet-timer">
            <p>Breaks </p>
            <h1>9:00 AM</h1>
        </div>
        <div className="timesheet-timer">
            <p>Working hours</p>
            <h1>9:00 AM</h1>
        </div>
        <div className="timesheet-timer">
            <p>Clock Out</p>
            <h1>9:00 AM</h1>
        </div>
      </div>

      <div className="custom-line no-margin"></div>

      {/* Status Filters */}
      <div className="rightsidebar-filter-progress">
        {statuses.map((status) => (
          <div
            key={status}
            onClick={() => handleFilterClick(status)}
            style={{ cursor: "pointer" }}
          >
            <ProgressFilter
              title={status}
              count={countByStatus(status)}
              bgColor={selectedStatus === status ? "#333" : "#f1f1f1"}
              color={selectedStatus === status ? "#fff" : "#000"}
            />
          </div>
        ))}
      </div>

      {/* Order Table */}
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div className="order-table-container" s>
          <table className="order-table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSortClick("id")}
                  style={{ cursor: "pointer" }}
                >
                  # {sortBy === "id" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSortClick("partName")}
                  style={{ cursor: "pointer" }}
                >
                  Name{" "}
                  {sortBy === "partName" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSortClick("partNumber")}
                  style={{ cursor: "pointer" }}
                >
                  Date{" "}
                  {sortBy === "vendor" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSortClick("partNumber")}
                  style={{ cursor: "pointer" }}
                >
                  Clock In{" "}
                  {sortBy === "vendor" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSortClick("partNumber")}
                  style={{ cursor: "pointer" }}
                >
                  Clock Out{" "}
                  {sortBy === "vendor" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSortClick("partNumber")}
                  style={{ cursor: "pointer" }}
                >
                Break{" "}
                  {sortBy === "vendor" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSortClick("partNumber")}
                  style={{ cursor: "pointer" }}
                >
                  Working Hours{" "}
                  {sortBy === "vendor" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSortClick("partNumber")}
                  style={{ cursor: "pointer" }}
                >
                  Overtime{" "}
                  {sortBy === "vendor" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
            
              
                <th
                  onClick={() => handleSortClick("status")}
                  style={{ cursor: "pointer" }}
                >
                  Status{" "}
                  {sortBy === "status" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSortClick("status")}
                  style={{ cursor: "pointer" }}
                >
                  Actions{" "}
                  {sortBy === "status" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
       
              </tr>
            </thead>
            <tbody>
              {Array.isArray(displayedOrders) &&
              displayedOrders.length === 0 ? (
                <tr>
                  <td colSpan="7">No data available</td>
                </tr>
              ) : (
                Array.isArray(displayedOrders) &&
                displayedOrders.map((order) => {
                  const { color, bgColor } = getStatusStyles(order.status);
                  return (
                    <tr key={order.id}
                    >
                      <td>{order.id}</td>
                      <td>{order.partName}</td>
                      <td>{order.vendor}</td>
                      <td>{order.quantity}</td>
                      <td>{order.quantity}</td>
                      <td>{order.quantity}</td>
                      <td>{order.quantity}</td>
                      <td>{order.comments}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            color,
                            backgroundColor: bgColor,
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontWeight: 500,
                            width: "fit-content",
                          }}
                        >
                          {order.status}
                        </div>
                      </td>
                      <td>
                        <div
                          className="action-buttons"
                          style={{ display: "flex", gap: "8px" }}
                        >
                          <button
                            className="edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(order);
                            }}
                          >
                            Edit
                          </button>
                          {user.name === "admin" && (
                          <button
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              promptDeleteConfirmation(order);
                            }}
                          >
                            Delete
                          </button>)}
                        </div>
                      </td>
                      
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        show={showAddModal}
        onHide={handleCloseAddModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <h3>Add Hitch Request</h3>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="custom-form">
            <div className="form-group">
              <label htmlFor="partName">Customer name</label>
              <input
                type="text"
                id="partName"
                name="partName"
                className="input-field"
                value={orderFormData.partName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="vendor">Phone number</label>
              <input
                type="text"
                id="vendor"
                name="vendor"
                className="input-field"
                value={orderFormData.vendor}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vendor">Vehicle make</label>
              <input
                type="text"
                id="vendor"
                name="vendor"
                className="input-field"
                value={orderFormData.vendor}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vendor">Vehicle model</label>
              <input
                type="text"
                id="vendor"
                name="vendor"
                className="input-field"
                value={orderFormData.vendor}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vendor">Vehicle year</label>
              <input
                type="text"
                id="vendor"
                name="vendor"
                className="input-field"
                value={orderFormData.vendor}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vendor">Part number</label>
              <input
                type="text"
                id="vendor"
                name="vendor"
                className="input-field"
                value={orderFormData.vendor}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateIn">Date In</label>
              <input
                type="date"
                id="dateIn"
                name="dateIn"
                className="input-field"
                value={null}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOut">Date Out</label>
              <input
                type="date"
                id="dateOut"
                name="dateOut"
                className="input-field"
                value={null}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vendor">Price</label>
              <input
                type="text"
                id="vendor"
                name="vendor"
                className="input-field"
                value={orderFormData.vendor}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                name="comments"
                className="input-field textarea"
                value={orderFormData.comments}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="input-field"
                value={orderFormData.status}
                onChange={handleChange}
              >
                <option>New Order</option>
                <option>Quoted</option>
                <option>Called</option>
                <option>Awaiting parts</option>
                <option>Rejected</option>
                <option>Scheduled</option>
                <option>Order Complete</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-secondary" onClick={handleCloseAddModal}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleAddSubmit}>
            Save
          </button>
        </Modal.Footer>
      </Modal>

      {/* Edit modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <h3>Edit timesheet</h3>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="custom-form">
            <div className="form-group">
              <label htmlFor="partName">Name</label>
              <input
                type="text"
                id="partName"
                name="partName"
                className="input-field"
                value={orderFormData.partName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateIn">Date</label>
              <input
                type="date"
                id="dateIn"
                name="dateIn"
                className="input-field"
                value={null}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOut">Clock in</label>
              <input
                type="time"
                id="dateOut"
                name="dateOut"
                className="input-field"
                value={null}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOut">Clock out</label>
              <input
                type="time"
                id="dateOut"
                name="dateOut"
                className="input-field"
                value={null}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOut">Break</label>
              <input
                type="time"
                id="dateOut"
                name="dateOut"
                className="input-field"
                value={null}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOut">Overtime</label>
              <input
                type="time"
                id="dateOut"
                name="dateOut"
                className="input-field"
                value={null}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="input-field"
                value={orderFormData.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Vacation</option>
                <option>Holiday parts</option>
                <option>Sick leave</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-secondary" onClick={handleCloseAddModal}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleAddSubmit}>
            Save
          </button>
        </Modal.Footer>
      </Modal>

      {/* Task Info Modal */}
      <Modal
        show={showInfoModal}
        onHide={handleCloseInfoModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <div className="info-group">
                <strong>Customer Name:</strong>
                <p>{selectedItem.customerName}</p>
              </div>
              {/* Display Phone Number in Info Modal */}
              <div className="info-group">
                <strong>Phone Number:</strong>
                <p>{selectedItem.phoneNumber}</p>
              </div>
              {/* Display Plate Number in Info Modal */}
              <div className="info-group">
                <strong>Vehicle make:</strong>
                <p>{selectedItem.plateNumber}</p>
              </div>
              <div className="info-group">
                <strong>Vehicle model:</strong>
                <p>{selectedItem.plateNumber}</p>
              </div>
              <div className="info-group">
                <strong>Vehicle year:</strong>
                <p>{selectedItem.plateNumber}</p>
              </div>
              
              <div className="info-group">
                <strong>Date In:</strong>
                <p>{selectedItem.dateIn}</p>
              </div>
              <div className="info-group">
                <strong>Date Out:</strong>
                <p>{selectedItem.dateOut}</p>
              </div>
              <div className="info-group">
                <strong>Job description:</strong>
                <p>{selectedItem.plateNumber}</p>
              </div>
              <div className="info-group">
                <strong>Price:</strong>
                <p>{selectedItem.plateNumber}</p>
              </div>
              <div className="info-group">
                <strong>Status:</strong>
                <p>{selectedItem.progress}</p>
              </div>
              <div className="info-group">
                <strong>Repairs Needed:</strong>
                <p>
                  {Array.isArray(selectedItem.repairNeeded)
                    ? selectedItem.repairNeeded.join(", ")
                    : selectedItem.repairNeeded}
                </p>
              </div>
              <div className="info-group">
                <strong>Parts Needed:</strong>
                <p>
                  {Array.isArray(selectedItem.partsNeeded)
                    ? selectedItem.partsNeeded
                        .map((part) => `${part.name} (${part.quantity})`)
                        .join(", ")
                    : selectedItem.partsNeeded}
                </p>
              </div>
              {selectedItem.comments && (
                <div className="info-group">
                  <strong>Comments:</strong>
                  <p>{selectedItem.comments}</p>
                </div>
              )}

              {/* Display Created By */}
              {selectedItem.author && (
                <div className="info-group">
                  <strong>Created By:</strong>
                  <p>{selectedItem.author.name}</p>
                </div>
              )}

              {/* Display Task History */}
              {selectedItem.history && selectedItem.history.length > 0 && (
                <div className="info-group">
                  <strong>Task History:</strong>
                  <ul>
                    {selectedItem.history.map((historyEntry) => (
                      <li key={historyEntry.id}>
                        {historyEntry.changes &&
                        typeof historyEntry.changes === "string" ? (
                          JSON.parse(historyEntry.changes).map(
                            (change, index) => <p key={index}>{change}</p>
                          )
                        ) : (
                          <p>{historyEntry.changes}</p>
                        )}
                        <small>
                          by{" "}
                          {historyEntry.user
                            ? historyEntry.user.name
                            : "Unknown User"}{" "}
                          on{" "}
                          {new Date(historyEntry.created_at).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-secondary" onClick={handleCloseInfoModal}>
            Cancel
          </button>
          {/* Delete button */}
          {user.name === "admin" && (
            <button
              className="btn-danger"
            //   onClick={(e) => {
            //     e.stopPropagation();
            //     promptDeleteConfirmation(order);
            //   }}
              onClick={() => handleDelete(selectedItem.id)}
            >
              Delete
            </button>
          )}
          {/* Edit button */}
          <button
            className="btn-primary"
            onClick={() => {
              handleCloseInfoModal();
              handleEditClick(selectedItem);
            }}
          >
            Edit
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmModal}
        onHide={() => setShowDeleteConfirmModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the order{" "}
          <strong>{orderToDelete?.partName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn-secondary"
            onClick={() => setShowDeleteConfirmModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={async () => {
              if (orderToDelete) {
                const success = await deleteOrder(orderToDelete.id);
                if (success) {
                  console.log(`Order ${orderToDelete.id} deleted.`);
                }
                setShowDeleteConfirmModal(false);
                setOrderToDelete(null);
              }
            }}
          >
            Confirm Delete
          </button>
        </Modal.Footer>
      </Modal>

      {/* Download modal  */}
      <Modal
        show={showDownloadModal}
        onHide={() => setShowDownloadModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Download Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>How would you like to download the data?</p>
          <div className="modal-button-download">
            <Button
              className="download-button"
              variant="outline-primary"
              onClick={() => handleDownload("pdf")}
            >
              PDF
            </Button>
            <Button
              variant="outline-success"
              onClick={() => handleDownload("csv")}
            >
              CSV
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDownloadModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimeCard;
