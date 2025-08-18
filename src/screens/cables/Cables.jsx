import React, { useState, useEffect } from "react";
import "../rightside/rightsidebar.css";
import Navbar from "../../components/navbar/Navbar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Calendar02Icon,
  FireIcon,
  ZapIcon,
  Coffee02Icon,
  GridViewIcon,
  LeftToRightListBulletIcon,
  Search01Icon,
  MoreHorizontalIcon,
  Download04FreeIcons,
} from "@hugeicons/core-free-icons";
import Priority from "../../components/priority/Priority";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RepairSelector from "../../components/repairs/Repairs";
import PartSelector from "../../components/repairs/Parts";
import ProgressFilter from "../../components/progressfilter/ProgressFilter";
import Pagination from "react-bootstrap/Pagination";
import { useCables } from "../../context/CableContext";
import { useAuth } from "../../context/AuthContext";
import ChangeUsersPassword from "../ChangeUsersPassword/changeUsersPassword";
import CableSelector from "../../components/repairs/CableSelector";

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

const Cables = ({ selected }) => {
  const {
    cablePaginationData,
    cables,
    loading,
    error,
    fetchCables,
    addCable,
    updateCable,
    deleteCable,
    exportCables,
    fetchCableCounts: fetchContextCableCounts,
    cableCounts: contextCableCounts,
  } = useCables();

  const [currentCablePage, setCurrentCablePage] = useState(
    cablePaginationData.current_page || 1
  );
  const itemsPerPage = cablePaginationData.per_page || 12;
  const [selectedStatus, setSelectedStatus] = useState("All");
  const statuses = [
    "All",
    "New",
    "In Progress",
    "Returns",
    "Awaiting Parts",
    "Awaiting Pickup",
    "Picked Up",
    "Shipped",
  ];

  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [viewMode, setViewMode] = useState("table");
  const [repairs, setRepairs] = useState([]);
  const [parts, setParts] = useState([]);
  const { token } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetFormData();
  };
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    setSelectedItem({});
  };
  const handleShowInfoModal = () => setShowInfoModal(true);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetFormData();
    setSelectedItem({});
  };
  const handleShowEditModal = () => setShowEditModal(true);

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    cableType: "",
    address: "",
    email: "",
    dateIn: "",
    dateOut: "",
    progress: "New",
    priority: "Low",
    comments: "",
    partsNeeded: [],
  });

  const [selectedItem, setSelectedItem] = useState({});

  const resetFormData = () => {
    setFormData({
      customerName: "",
      phoneNumber: "",
      cableType: "",
      address: "",
      email: "",
      dateIn: "",
      dateOut: "",
      progress: "New",
      priority: "Low",
      comments: "",
      partsNeeded: [],
    });
    setRepairs([]);
    setParts([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async () => {
    const finalData = {
      ...formData,
      partsNeeded: parts,
      repairNeeded: repairs,
    };
    const success = await addCable(finalData);
    if (success) {
      handleCloseAddModal();
      fetchContextCableCounts();
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedItem.id) return;
    const finalData = {
      ...formData,
      partsNeeded: parts,
      repairNeeded: repairs,
    };
    const success = await updateCable(selectedItem.id, finalData);
    if (success) {
      handleCloseEditModal();
      fetchContextCableCounts();
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteCable(id);
    if (success) {
      handleCloseInfoModal();
      fetchContextCableCounts();
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setFormData({
      customerName: item.customerName || "",
      phoneNumber: item.phoneNumber || "",
      email: item.email || "",
      cableType: item.cableType || "",
      address: item.address || "",
      dateIn: item.dateIn || "",
      dateOut: item.dateOut || "",
      progress: item.progress || "New",
      comments: item.comments || "",
      priority: item.priority || "Low",
      partsNeeded: item.partsNeeded || [],
    });
    setRepairs(item.repairNeeded || []);
    setParts(item.partsNeeded || []);
    handleShowEditModal();
  };

  const countByStatus = (status) => {
    return contextCableCounts[status] || 0;
  };

  const displayedCables = cables;
  const totalPages = cablePaginationData.last_page || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentCablePage(pageNumber);
  };

  const handleSortClick = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
    setCurrentCablePage(1);
  };

  useEffect(() => {
    const params = {
      page: currentCablePage,
      per_page: itemsPerPage,
      ...(selectedStatus !== "All" && { progress: selectedStatus }),
      sortBy: sortBy,
      sortDirection: sortDirection,
      ...(startDate && { startDate: startDate }),
      ...(endDate && { endDate: endDate }),
      ...(searchTerm && { search: searchTerm }),
    };
    fetchCables(params);
  }, [
    currentCablePage,
    selectedStatus,
    sortBy,
    sortDirection,
    itemsPerPage,
    startDate,
    endDate,
    searchTerm,
  ]);

  useEffect(() => {
    fetchContextCableCounts();
  }, [startDate, endDate, searchTerm]);

  useEffect(() => {
    if (
      cablePaginationData.current_page &&
      cablePaginationData.current_page !== currentCablePage
    ) {
      setCurrentCablePage(cablePaginationData.current_page);
    }
  }, [cablePaginationData.current_page]);

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
    setCurrentCablePage(1);
  };

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
    setCurrentCablePage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentCablePage(1);
  };

  const handleDownload = async (type) => {
    console.log(`Downloading cables as ${type}`);
    const params = {
      sortBy: sortBy,
      sortDirection: sortDirection,
      ...(searchTerm && { search: searchTerm }),
    };
    await exportCables(type, params);
    setShowDownloadModal(false);
  };

  return (
    <div className="rightsidebar-container">
      {selected === "Cables" && (
      <div className="rightsidebar-bottom">
        <div className="rightsidebar-navbar">
          <h3>Madison Generator – Cables</h3>
          <div className="button-group d-flex flex-row">
            <div className="rightsidebar-button" onClick={handleShowAddModal}>
              <HugeiconsIcon
                icon={Add01Icon}
                size={16}
                color="#ffffff"
                strokeWidth={3}
              />
              <p>New Order</p>
            </div>
            <div
              className="rightsidebar-button"
              style={{ backgroundColor: "#3c58ae", marginLeft: "10px" }}
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
        </div>
        <div className="rightsidebar-filter">
          <div className="rightsidebar-filter-button">
            <div
              className={`custom-filter-button ${
                viewMode === "table" ? "active" : ""
              }`}
              onClick={() => setViewMode("table")}
            >
              <HugeiconsIcon
                icon={LeftToRightListBulletIcon}
                size={14}
                color="#545454"
              />
              <p>List</p>
            </div>
            <div
              className={`custom-filter-button ${
                viewMode === "grid" ? "active" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <HugeiconsIcon
                icon={GridViewIcon}
                size={14}
                color="#545454"
              />
              <p>Grid</p>
            </div>
          </div>

          <div className="search-input-container">
            <HugeiconsIcon icon={Search01Icon} size={16} color="#545454" />
            <input
              type="text"
              placeholder="Search order..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="rightsidebar-filter-date">
            <div className="date-range-picker">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={handleDateFilterChange}
                className="date-input custom-filter-button filter-date"
              />
            </div>
            <div className="date-range-picker mx-2">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={handleDateFilterChange}
                className="date-input custom-filter-button filter-date"
              />
            </div>

            {(startDate || endDate) && (
              <button
                className="clear-date-button"
                onClick={clearDateFilters}
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>

        <div className="custom-line no-margin"></div>

        <div className="rightsidebar-filter-progress">
          {statuses.map((status) => (
            <div
              key={status}
              onClick={() => setSelectedStatus(status)}
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

        <div className="rightsidebar-table">
          {loading ? (
            <p>Loading cables...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : viewMode === "table" ? (
            <div className="order-table-container">
              <div className="rightsidebar-table">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSortClick("id")}
                        style={{ cursor: "pointer" }}
                      >
                        s/n{" "}
                        {sortBy === "id" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSortClick("customerName")}
                        style={{ cursor: "pointer" }}
                      >
                        Customer Name{" "}
                        {sortBy === "customerName" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSortClick("cableType")}
                        style={{ cursor: "pointer" }}
                      >
                        Cable Type{" "}
                        {sortBy === "cableType" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSortClick("phoneNumber")}
                        style={{ cursor: "pointer" }}
                      >
                        Phone Number{" "}
                        {sortBy === "phoneNumber" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSortClick("email")}
                        style={{ cursor: "pointer" }}
                      >
                        Email{" "}
                        {sortBy === "email" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSortClick("dateIn")}
                        style={{ cursor: "pointer" }}
                      >
                        Date-In{" "}
                        {sortBy === "dateIn" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSortClick("dateOut")}
                        style={{ cursor: "pointer" }}
                      >
                        Date-Out{" "}
                        {sortBy === "dateOut" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSortClick("progress")}
                        style={{ cursor: "pointer" }}
                      >
                        Progress{" "}
                        {sortBy === "progress" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th>Parts Needed</th>
                      <th
                        onClick={() => handleSortClick("priority")}
                        style={{ cursor: "pointer" }}
                      >
                        Priority{" "}
                        {sortBy === "priority" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(displayedCables) &&
                    displayedCables.length === 0 ? (
                      <tr>
                        <td colSpan="10">No data available</td>
                      </tr>
                    ) : (
                      Array.isArray(displayedCables) &&
                      displayedCables.map((item) => {
                        const { color, bgColor, icon } = getPriorityStyles(
                          item.priority
                        );
                        return (
                          <tr
                            key={item.id}
                            onClick={() => {
                              setSelectedItem(item);
                              handleShowInfoModal();
                            }}
                          >
                            <td>{item.id}</td>
                            <td>{item.customerName}</td>
                            <td>{item.cableType}</td>
                            <td>{item.phoneNumber}</td>
                            <td>
                              {item?.email ? 
                                (item?.email.length > 10
                                  ? `${item.email.slice(0, 10)}...`
                                  : item?.email)
                                :
                                ""}
                            </td>
                            <td>{item.dateIn}</td>
                            <td>{item.dateOut}</td>
                            <td>{item.progress}</td>
                            <td>
                              {Array.isArray(item.partsNeeded)
                                ? (() => {
                                    const fullText = item.partsNeeded
                                      .map(
                                        (part) =>
                                          `${part.name} (${part.quantity})`
                                      )
                                      .join(", ");

                                    const maxLength = 35;

                                    return fullText.length > maxLength
                                      ? `${fullText.slice(0, maxLength)}...`
                                      : fullText;
                                  })()
                                : item.partsNeeded}
                            </td>
                            <td>
                              <Priority
                                color={color}
                                bgColor={bgColor}
                                icon={icon}
                                title={item.priority}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                <div className="custom-grid-pagination table">
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentCablePage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentCablePage - 1)}
                      disabled={currentCablePage === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentCablePage}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentCablePage + 1)}
                      disabled={currentCablePage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentCablePage === totalPages}
                    />
                  </Pagination>
                </div>
              </div>
            </div>
          ) : (
            <div className="order-table-container">
              <div className="gridview-container">
                {Array.isArray(displayedCables) &&
                displayedCables.length === 0 ? (
                  <div className="no-data-message">
                    <p>No data available.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid-view">
                      {Array.isArray(displayedCables) &&
                        displayedCables.map((item) => {
                          const { color, bgColor, icon } =
                            getPriorityStyles(item.priority);
                          return (
                            <div
                              key={item.id}
                              className="custom-grid"
                              onClick={() => {
                                setSelectedItem(item);
                                handleShowInfoModal();
                              }}
                            >
                              <div className="custom-grid-top-container">
                                <Priority
                                  color={color}
                                  bgColor={bgColor}
                                  icon={icon}
                                  title={item.priority}
                                />
                                <div className="custom-grid-edit">
                                  <HugeiconsIcon
                                    icon={MoreHorizontalIcon}
                                    size={20}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClick(item);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="custom-grid-bottom-container">
                                <h3>{item.customerName}</h3>
                                <p>Cable Type: {item.cableType}</p>
                                <p>Phone: {item.phoneNumber}</p>
                                <p>Email: {item.email}</p>
                                <div className="custom-line"></div>
                                <div className="custom-grid-bottom-date">
                                  <p>{item.dateIn}</p>
                                  <p>{item.progress}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="custom-grid-pagination">
                      <Pagination>
                        <Pagination.First
                          onClick={() => handlePageChange(1)}
                          disabled={currentCablePage === 1}
                        />
                        <Pagination.Prev
                          onClick={() => handlePageChange(currentCablePage - 1)}
                          disabled={currentCablePage === 1}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                          <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentCablePage}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next
                          onClick={() => handlePageChange(currentCablePage + 1)}
                          disabled={currentCablePage === totalPages}
                        />
                        <Pagination.Last
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentCablePage === totalPages}
                        />
                      </Pagination>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>)}

      <Modal
        show={showAddModal}
        onHide={handleCloseAddModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>New Cable Order</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="custom-form">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                className="input-field"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="cableType">Cable Type</label>
              <input
                type="text"
                id="cableType"
                name="cableType"
                className="input-field"
                value={formData.cableType}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="input-field"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="input-field"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                className="input-field"
                value={formData.email}
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
                value={formData.dateIn}
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
                value={formData.dateOut}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="progress">Status</label>
              <select
                id="progress"
                name="progress"
                className="input-field"
                value={formData.progress}
                onChange={handleChange}
              >
                <option>New</option>
                <option>In Progress</option>
                <option>Returns</option>
                <option>Awaiting Parts</option>
                <option>Rejected Jobs</option>
                <option>Awaiting Pickup</option>
                <option>Picked Up</option>
              </select>
            </div>
            <div className="form-group">
              <CableSelector
                selectedCable={repairs}
                setSelectedCable={setRepairs}
              />
              <p>Selected Repairs: {repairs.join(", ")}</p>
            </div>
            <div className="form-group">
              <PartSelector selectedParts={parts} setSelectedParts={setParts} />
              <p>
                Selected Parts:{" "}
                {Array.isArray(parts)
                  ? parts
                      .map((part) => `${part.name} (${part.quantity})`)
                      .join(", ")
                  : parts}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                className="input-field"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                name="comments"
                className="input-field textarea"
                value={formData.comments}
                onChange={handleChange}
              />
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

      <Modal
        show={showInfoModal}
        onHide={handleCloseInfoModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Cable Details</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <div className="info-group">
                <strong>Customer Name:</strong>
                <p>{selectedItem.customerName}</p>
              </div>
              <div className="info-group">
                <strong>Cable Type:</strong>
                <p>{selectedItem.cableType}</p>
              </div>
              <div className="info-group">
                <strong>Phone Number:</strong>
                <p>{selectedItem.phoneNumber}</p>
              </div>
              <div className="info-group">
                <strong>Address:</strong>
                <p>{selectedItem.address}</p>
              </div>
              <div className="info-group">
                <strong>Email:</strong>
                <p>{selectedItem.email}</p>
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
              <div className="info-group">
                <strong>Priority:</strong>
                <p>{selectedItem.priority}</p>
              </div>
              {selectedItem.comments && (
                <div className="info-group">
                  <strong>Comments:</strong>
                  <p>{selectedItem.comments}</p>
                </div>
              )}
              {selectedItem.author && (
                <div className="info-group">
                  <strong>Created By:</strong>
                  <p>{selectedItem.author.name}</p>
                </div>
              )}
              {selectedItem.history && selectedItem.history.length > 0 && (
                <div className="info-group">
                  <strong>Cable History:</strong>
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
          {user.name === "admin" && (
            <button
              className="btn-danger"
              onClick={() => handleDelete(selectedItem.id)}
            >
              Delete
            </button>
          )}
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

      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Edit Order</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="custom-form">
            <div className="form-group">
              <label htmlFor="editCustomerName">Customer Name</label>
              <input
                type="text"
                id="editCustomerName"
                name="customerName"
                className="input-field"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="editCableType">Cable Type</label>
              <input
                type="text"
                id="editCableType"
                name="cableType"
                className="input-field"
                value={formData.cableType}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="editPhoneNumber">Phone Number</label>
              <input
                type="text"
                id="editPhoneNumber"
                name="phoneNumber"
                className="input-field"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="editAddress">Address</label>
              <input
                type="text"
                id="editAddress"
                name="address"
                className="input-field"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="editEmail">Email</label>
              <input
                type="text"
                id="editEmail"
                name="email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="editDateIn">Date In</label>
              <input
                type="date"
                id="editDateIn"
                name="dateIn"
                className="input-field"
                value={formData.dateIn}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="editDateOut">Date Out</label>
              <input
                type="date"
                id="editDateOut"
                name="dateOut"
                className="input-field"
                value={formData.dateOut}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="editProgress">Status</label>
              <select
                id="editProgress"
                name="progress"
                className="input-field"
                value={formData.progress}
                onChange={handleChange}
              >
                <option>New</option>
                <option>In Progress</option>
                <option>Return</option>
                <option>Awaiting Parts</option>
                <option>Rejected Jobs</option>
                <option>Awaiting Pickup</option>
                <option>Picked Up</option>
              </select>
            </div>
            <div className="form-group">
              <CableSelector
                selectedCable={repairs}
                setSelectedCable={setRepairs}
              />
              <p className="pb-2">Selected Repairs:</p>
              <div className="selected-repairs-list">
                {Array.isArray(repairs) && repairs.length > 0 ? (
                  repairs.map((repair, index) => (
                    <div key={index} className="selected-repair-item">
                      <span>{repair}</span>
                      <button
                        type="button"
                        className="remove-repair-button"
                        onClick={() => {
                          const updatedRepairs = repairs.filter(
                            (_, i) => i !== index
                          );
                          setRepairs(updatedRepairs);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No repairs selected</p>
                )}
              </div>
            </div>
            <div className="form-group">
              <PartSelector selectedParts={parts} setSelectedParts={setParts} />
              <div className="selected-parts-list">
                {Array.isArray(parts) && parts.length > 0 ? (
                  parts.map((part, index) => (
                    <div key={index} className="selected-part-item">
                      <span>
                        {part.name} (Qty: {part.quantity})
                      </span>
                      <button
                        type="button"
                        className="remove-part-button"
                        onClick={() => {
                          const updatedParts = [...parts];
                          updatedParts.splice(index, 1);
                          setParts(updatedParts);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No parts selected</p>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="editPriority">Priority</label>
              <select
                id="editPriority"
                name="priority"
                className="input-field"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="editComments">Comments</label>
              <textarea
                id="editComments"
                name="comments"
                className="input-field textarea"
                value={formData.comments}
                onChange={handleChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-secondary" onClick={handleCloseEditModal}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleEditSubmit}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Download Cable Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>How would you like to download the cable data?</p>
          <div className="modal-button-download">
            <Button className="download-button" variant="outline-primary" onClick={() => handleDownload('pdf')}>PDF</Button>
            <Button variant="outline-success" onClick={() => handleDownload('csv')}>CSV</Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDownloadModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cables;