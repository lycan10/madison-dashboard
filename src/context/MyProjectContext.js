import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const MyProjectContext = createContext(null);

export const MyProjectProvider = ({ children }) => {
    const { token, logout, user: authUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [taskPaginationData, setTaskPaginationData] = useState({
        current_page: 1,
        per_page: 10,
        last_page: 1,
        total: 0,
    });
    const [taskCounts, setTaskCounts] = useState({
        All: 0, "New Task": 0, "In Progress": 0, "Pending Review": 0,
        "On Hold": 0, "Completed": 0, "Cancelled": 0, "Overdue": 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async (params = {}) => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        const queryParams = new URLSearchParams(params).toString();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/tasks?${queryParams}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const data = await response.json();
            setTasks(data.data);
            setTaskPaginationData({
                current_page: data.current_page,
                per_page: data.per_page,
                last_page: data.last_page,
                total: data.total,
            });
        } catch (err) {
            console.error("Fetch tasks error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, logout]);

    const fetchStatusCounts = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tasks/counts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch task counts");
            const data = await response.json();
            setTaskCounts(data);
        } catch (error) {
            console.error("Error fetching status counts:", error);
        }
    }, [token]);

    const addTask = async (taskData) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/tasks`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(taskData),
                }
            );
            if (!response.ok) throw new Error('Failed to add task');
            fetchTasks({ page: taskPaginationData.current_page, perPage: taskPaginationData.per_page });
            fetchStatusCounts();
            return true;
        } catch (error) {
            console.error("Add task error:", error);
            return false;
        }
    };

    const updateTask = async (taskId, taskData) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/tasks/${taskId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(taskData),
                }
            );
            if (!response.ok) throw new Error('Failed to update task');
            fetchTasks({ page: taskPaginationData.current_page, perPage: taskPaginationData.per_page });
            return true;
        } catch (error) {
            console.error("Update task error:", error);
            return false;
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/tasks/${taskId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) throw new Error('Failed to delete task');
            fetchTasks({ page: taskPaginationData.current_page, perPage: taskPaginationData.per_page });
            fetchStatusCounts();
            return true;
        } catch (error) {
            console.error("Delete task error:", error);
            return false;
        }
    };
    
    // A function to fetch the list of all users for admin task assignment
    const fetchUsers = async () => {
        if (!token) return [];
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    };

    return (
        <MyProjectContext.Provider
            value={{
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
            }}
        >
            {children}
        </MyProjectContext.Provider>
    );
};

export const useMyProject = () => {
    return useContext(MyProjectContext);
};