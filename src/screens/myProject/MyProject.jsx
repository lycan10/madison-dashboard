// src/pages/myproject/MyProject.jsx
import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import "../order/order.css";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Search01Icon,  FireIcon,
  ZapIcon,
  Coffee02Icon, } from "@hugeicons/core-free-icons";
import ProgressFilter from "../../components/progressfilter/ProgressFilter";
import Pagination from "react-bootstrap/Pagination";
import { useMyProject } from "../../context/MyProjectContext";
import { useAuth } from "../../context/AuthContext";
import Priority from "../../components/priority/Priority";

const getStatusStyles = (status) => {
  switch (status) {
    case "Not Task":
      return { color: "#FFA500", bgColor: "#FFF7E6" };
    case "In Progress":
      return { color: "#007BFF", bgColor: "#E6F2FF" };
    case "Pending Review":
      return { color: "#17A2B8", bgColor: "#E0F7FA" };
    case "On Hold":
      return { color: "#28A745", bgColor: "#E8F6EA" };
    case "Completed":
      return { color: "#20C997", bgColor: "#E6FFFA" };
    case "Cancelled":
      return { color: "#DC3545", bgColor: "#FDEAEA" };
    case "Overdue":
      return { color: "#6F42C1", bgColor: "#F3E8FF" };
    default:
      return { color: "#6C757D", bgColor: "#F8F9FA" };
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


const MyProject = () => {
    const {
        tasks,
        taskPaginationData,
        taskCounts,
        loading,
        error,
        fetchTasks,
        fetchStatusCounts,
        addTask,
        updateTask,
        deleteTask,
        fetchUsers
    } = useMyProject();

    const { user: authUser } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [selectedStatus, setSelectedStatus] = useState("All");
    const statuses = [
        "All", "New Task", "In Progress", "Pending Review",
        "On Hold", "Completed", "Cancelled", "Overdue"
    ];
    const [sortBy, setSortBy] = useState("created_at");
    const [sortDirection, setSortDirection] = useState("desc");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    
    const [taskFormData, setTaskFormData] = useState({
        taskName: "",
        description: "",
        startDate: "",
        deadlineDate: "",
        priority: "Low",
        status: "New Task",
        assignedToUserId: authUser?.id || null, // Default to current user
    });

    const [editingTask, setEditingTask] = useState(null);

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        resetTaskFormData();
    };
    const handleShowAddModal = () => {
        if (authUser?.role === 'admin') {
            fetchUsers().then(setUsers);
        }
        setShowAddModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingTask(null);
        resetTaskFormData();
    };
    const handleShowEditModal = () => {
        if (authUser?.role === 'admin') {
            fetchUsers().then(setUsers);
        }
        setShowEditModal(true);
    };

    const resetTaskFormData = () => {
        setTaskFormData({
            taskName: "",
            description: "",
            startDate: "",
            deadlineDate: "",
            priority: "Low",
            status: "New Task",
            assignedToUserId: authUser?.id || null,
        });
    };

    const handleFilterClick = (status) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSubmit = async () => {
        const success = await addTask({ ...taskFormData });
        if (success) {
            handleCloseAddModal();
        }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setTaskFormData({
            taskName: task.task_name,
            description: task.description,
            startDate: task.start_date,
            deadlineDate: task.deadline_date,
            priority: task.priority,
            status: task.status,
            assignedToUserId: task.user_id,
        });
        handleShowEditModal();
    };

    const handleEditSubmit = async () => {
        if (!editingTask) return;
        const success = await updateTask(editingTask.id, { ...taskFormData });
        if (success) {
            handleCloseEditModal();
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteTask(id);
        if (success) {
            console.log(`Task with ID ${id} deleted successfully.`);
        }
    };

    const totalPages = taskPaginationData.last_page;

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

    useEffect(() => {
        const params = {
            page: currentPage,
            perPage: itemsPerPage,
            ...(selectedStatus !== "All" && { status: selectedStatus }),
            sortBy: sortBy,
            sortDirection: sortDirection,
            ...(searchTerm && { search: searchTerm }),
        };
        fetchTasks(params);
    }, [selectedStatus, sortBy, sortDirection, currentPage, searchTerm, fetchTasks]);

    useEffect(() => {
        fetchStatusCounts();
    }, [fetchStatusCounts, currentPage]);

    useEffect(() => {
        if (
            taskPaginationData.current_page &&
            taskPaginationData.current_page !== currentPage
        ) {
            setCurrentPage(taskPaginationData.current_page);
        }
    }, [taskPaginationData.current_page]);


    const countByStatus = (status) => {
        return taskCounts[status] || 0;
    };

    const promptDeleteConfirmation = (task) => {
        setTaskToDelete(task);
        setShowDeleteConfirmModal(true);
    };

    return (
        <div className="order-page">
            <div className="rightsidebar-navbar">
                <h3>Tasks</h3>

                <div className="rightsidebar-button" onClick={handleShowAddModal}>
                    <HugeiconsIcon icon={Add01Icon} size={16} color="#ffffff" strokeWidth={3} />
                    <p>New Task</p>
                </div>
            </div>

            {/* Search Input */}
            <div className="search-input-container">
                <HugeiconsIcon icon={Search01Icon} size={16} color="#545454" />
                <input
                    type="text"
                    placeholder="Search task..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
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

            {/* Task Table */}
            {loading ? (
                <p>Loading tasks...</p>
            ) : error ? (
                <p>Error: {error.message}</p>
            ) : (
                <div className="order-table-container">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSortClick("id")} style={{ cursor: "pointer" }}>
                                    # {sortBy === "id" && (sortDirection === "asc" ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSortClick("task_name")} style={{ cursor: "pointer" }}>
                                    Task Name{" "}
                                    {sortBy === "task_name" && (sortDirection === "asc" ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSortClick("description")} style={{ cursor: "pointer" }}>
                                    Description{" "}
                                    {sortBy === "description" && (sortDirection === "asc" ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSortClick("start_date")} style={{ cursor: "pointer" }}>
                                    Start date{" "}
                                    {sortBy === "start_date" && (sortDirection === "asc" ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSortClick("deadline_date")} style={{ cursor: "pointer" }}>
                                    Deadline date{" "}
                                    {sortBy === "deadline_date" && (sortDirection === "asc" ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSortClick("priority")} style={{ cursor: "pointer" }}>
                                    Priority{" "}
                                    {sortBy === "priority" && (sortDirection === "asc" ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSortClick("status")} style={{ cursor: "pointer" }}>
                                    Status{" "}
                                    {sortBy === "status" && (sortDirection === "asc" ? "▲" : "▼")}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(tasks) && tasks.length === 0 ? (
                                <tr>
                                    <td colSpan="8">No data available</td>
                                </tr>
                            ) : (
                                Array.isArray(tasks) &&
                                tasks.map((task) => {
                                    const { color, bgColor } = getStatusStyles(task.status);
                                    const { icon: priorityIcon, ...priorityStyles } = getPriorityStyles(task.priority);
                                    return (
                                        <tr key={task.id}>
                                            <td>{task.id}</td>
                                            <td>{task.task_name.length > 20 ? task.task_name.slice(0, 20) + "..." : task.task_name}</td>
                                            <td dangerouslySetInnerHTML={{ __html: task.description.length > 20 ? task.description.slice(0, 20) + "..." : task.description }}></td>
                                            <td>{task.start_date}</td>
                                            <td>{task.deadline_date}</td>
                                            <td>
                                                <Priority
                                                  color={priorityStyles.color}
                                                  bgColor={priorityStyles.bgColor}
                                                  icon={priorityIcon}
                                                  title={task.priority}
                                                />
                                            </td>
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
                                                    {task.status}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons" style={{ display: "flex", gap: "8px" }}>
                                                    <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEditClick(task); }}>
                                                        Edit
                                                    </button>
                                                    {(authUser?.role === 'admin' || task.user_id === authUser?.id) && (
                                                        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); promptDeleteConfirmation(task); }}>
                                                            Delete
                                                        </button>
                                                    )}
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

            <div className="custom-grid-pagination table">
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>

            {/* Add Task Modal */}
            <Modal show={showAddModal} onHide={handleCloseAddModal} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title><h3>Add New Task</h3></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="custom-form">
                        <div className="form-group">
                            <label htmlFor="taskName">Task Name</label>
                            <input type="text" id="taskName" name="taskName" className="input-field" value={taskFormData.taskName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" name="description" className="input-field textarea" value={taskFormData.description} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <input type="date" id="startDate" name="startDate" className="input-field" value={taskFormData.startDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="deadlineDate">Deadline Date</label>
                            <input type="date" id="deadlineDate" name="deadlineDate" className="input-field" value={taskFormData.deadlineDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select id="priority" name="priority" className="input-field" value={taskFormData.priority} onChange={handleChange}>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status" className="input-field" value={taskFormData.status} onChange={handleChange}>
                                <option>New Task</option>
                                <option>In Progress</option>
                                <option>Pending Review</option>
                                <option>On Hold</option>
                                <option>Completed</option>
                                <option>Cancelled</option>
                                <option>Overdue</option>
                            </select>
                        </div>
                        {authUser?.role === 'admin' && (
                            <div className="form-group">
                                <label htmlFor="assignedTo">Assign To</label>
                                <select id="assignedTo" name="assignedToUserId" className="input-field" value={taskFormData.assignedToUserId} onChange={handleChange}>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn-secondary" onClick={handleCloseAddModal}>Cancel</button>
                    <button className="btn-primary" onClick={handleAddSubmit}>Save</button>
                </Modal.Footer>
            </Modal>

            {/* Edit Task Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title><h3>Edit Task</h3></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="custom-form">
                        <div className="form-group">
                            <label htmlFor="editTaskName">Task Name</label>
                            <input type="text" id="editTaskName" name="taskName" className="input-field" value={taskFormData.taskName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="editDescription">Description</label>
                            <textarea id="editDescription" name="description" className="input-field textarea" value={taskFormData.description} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="editStartDate">Start Date</label>
                            <input type="date" id="editStartDate" name="startDate" className="input-field" value={taskFormData.startDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="editDeadlineDate">Deadline Date</label>
                            <input type="date" id="editDeadlineDate" name="deadlineDate" className="input-field" value={taskFormData.deadlineDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="editPriority">Priority</label>
                            <select id="editPriority" name="priority" className="input-field" value={taskFormData.priority} onChange={handleChange}>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="editStatus">Status</label>
                            <select id="editStatus" name="status" className="input-field" value={taskFormData.status} onChange={handleChange}>
                                <option>New Task</option>
                                <option>In Progress</option>
                                <option>Pending Review</option>
                                <option>On Hold</option>
                                <option>Completed</option>
                                <option>Cancelled</option>
                                <option>Overdue</option>
                            </select>
                        </div>
                        {authUser?.role === 'admin' && (
                            <div className="form-group">
                                <label htmlFor="editAssignedTo">Assign To</label>
                                <select id="editAssignedTo" name="assignedToUserId" className="input-field" value={taskFormData.assignedToUserId} onChange={handleChange}>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn-secondary" onClick={handleCloseEditModal}>Cancel</button>
                    <button className="btn-primary" onClick={handleEditSubmit}>Save Changes</button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the task <strong>{taskToDelete?.task_name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn-secondary" onClick={() => setShowDeleteConfirmModal(false)}>Cancel</button>
                    <button className="btn-danger" onClick={async () => {
                        if (taskToDelete) {
                            await deleteTask(taskToDelete.id);
                            setShowDeleteConfirmModal(false);
                            setTaskToDelete(null);
                        }
                    }}>
                        Confirm Delete
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyProject;