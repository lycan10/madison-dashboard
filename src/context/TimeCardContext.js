import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const TimeCardContext = createContext(null);

export const TimeCardProvider = ({ children }) => {
  const [timeCardPaginationData, setTimeCardPaginationData] = useState({
    current_page: 1,
    data: [],
    first_page_url: null,
    from: null,
    last_page: 1,
    last_page_url: null,
    links: [],
    next_page_url: null,
    path: null,
    per_page: 50,
    prev_page_url: null,
    to: null,
    total: 0,
    date: new Date().toISOString().slice(0, 10),
  });
  const [currentActiveTimeCard, setCurrentActiveTimeCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    All: 0,
    Active: 0,
    Holiday: 0,
    Vacation: 0,
    Inactive: 0,
    "Sick leave": 0,
  });
  const [users, setUsers] = useState([]);
  const { token, user } = useAuth();

  const TIMECARDS_API_URL = `${process.env.REACT_APP_BASE_URL}/api/timecards`;
  const LEAVE_API_URL = `${process.env.REACT_APP_BASE_URL}/api/leave-statuses`;

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/timecard/allusers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data || []);
    } catch (err) {
      setError(err);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchTimeCards = useCallback(
    async (params = {}) => {
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${TIMECARDS_API_URL}?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch time cards");
        }

        const data = await response.json();
        setTimeCardPaginationData(data);
      } catch (err) {
        setError(err);
        console.error("Error fetching time cards:", err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const fetchCurrentDayTimeCard = useCallback(async () => {
    if (!token || !user?.id) {
      setCurrentActiveTimeCard(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/timecard/today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        if (response.status === 404) {
          setCurrentActiveTimeCard(null);
          return;
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch current day time card"
        );
      }

      const data = await response.json();
      setCurrentActiveTimeCard(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching current day time card:", err);
      setCurrentActiveTimeCard(null);
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  const fetchStatusCounts = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/timecard/status-counts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch status counts");
      }

      const data = await response.json();
      setStatusCounts(data);
    } catch (err) {
      console.error("Error fetching status counts:", err);
    }
  }, [token]);

  const addTimeCard = useCallback(
    async (timeCardData) => {
      if (!token) return false;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(TIMECARDS_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(timeCardData),
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add time card");
        }

        fetchTimeCards({
          page: timeCardPaginationData.current_page,
          perPage: timeCardPaginationData.per_page,
          date: timeCardPaginationData.date,
          ...(timeCardPaginationData.status && {
            status: timeCardPaginationData.status,
          }),
        });
        fetchStatusCounts();
        await fetchCurrentDayTimeCard();
        return true;
      } catch (err) {
        setError(err);
        console.error("Error adding time card:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      token,
      fetchTimeCards,
      fetchStatusCounts,
      timeCardPaginationData,
      fetchCurrentDayTimeCard,
    ]
  );

  const updateTimeCard = useCallback(
    async (id, timeCardData) => {
      console.log(id);
      if (!token) return false;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${TIMECARDS_API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(timeCardData),
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update time card");
        }

        fetchTimeCards({
          page: timeCardPaginationData.current_page,
          perPage: timeCardPaginationData.per_page,
          date: timeCardPaginationData.date,
          ...(timeCardPaginationData.status && {
            status: timeCardPaginationData.status,
          }),
        });
        fetchStatusCounts();
        await fetchCurrentDayTimeCard();
        return true;
      } catch (err) {
        setError(err);
        console.error("Error updating time card:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      token,
      fetchTimeCards,
      fetchStatusCounts,
      timeCardPaginationData,
      fetchCurrentDayTimeCard,
    ]
  );

  const deleteTimeCard = useCallback(
    async (id) => {
      if (!token) return false;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${TIMECARDS_API_URL}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete time card");
        }

        fetchTimeCards({
          page: timeCardPaginationData.current_page,
          perPage: timeCardPaginationData.per_page,
          date: timeCardPaginationData.date,
          ...(timeCardPaginationData.status && {
            status: timeCardPaginationData.status,
          }),
        });
        fetchStatusCounts();
        await fetchCurrentDayTimeCard();
        return true;
      } catch (err) {
        setError(err);
        console.error("Error deleting time card:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      token,
      fetchTimeCards,
      fetchStatusCounts,
      timeCardPaginationData,
      fetchCurrentDayTimeCard,
    ]
  );

  const clockIn = useCallback(async () => {
    if (!token || !user?.id) return false;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/timecard/clockin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: user.id }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clock in");
      }

      await fetchCurrentDayTimeCard();
      fetchTimeCards({
        page: timeCardPaginationData.current_page,
        perPage: timeCardPaginationData.per_page,
        date: timeCardPaginationData.date,
        ...(timeCardPaginationData.status && {
          status: timeCardPaginationData.status,
        }),
      });
      fetchStatusCounts();
      return true;
    } catch (err) {
      setError(err);
      console.error("Clock in error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    token,
    user?.id,
    fetchCurrentDayTimeCard,
    fetchTimeCards,
    fetchStatusCounts,
    timeCardPaginationData,
  ]);

  const clockOut = useCallback(async () => {
    if (!token || !user?.id) return false;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/timecard/clockout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clock out");
      }

      await fetchCurrentDayTimeCard();
      fetchTimeCards({
        page: timeCardPaginationData.current_page,
        perPage: timeCardPaginationData.per_page,
        date: timeCardPaginationData.date,
        ...(timeCardPaginationData.status && {
          status: timeCardPaginationData.status,
        }),
      });
      fetchStatusCounts();
      return true;
    } catch (err) {
      setError(err);
      console.error("Clock out error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    token,
    user?.id,
    fetchCurrentDayTimeCard,
    fetchTimeCards,
    fetchStatusCounts,
    timeCardPaginationData,
  ]);

  const startBreak = useCallback(async () => {
    if (!token || !user?.id || !currentActiveTimeCard) return false;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/timecard/breakstart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to start break");
      }

      await fetchCurrentDayTimeCard();
      fetchTimeCards({
        page: timeCardPaginationData.current_page,
        perPage: timeCardPaginationData.per_page,
        date: timeCardPaginationData.date,
        ...(timeCardPaginationData.status && {
          status: timeCardPaginationData.status,
        }),
      });
      fetchStatusCounts();
      return true;
    } catch (err) {
      setError(err);
      console.error("Start break error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    token,
    user?.id,
    currentActiveTimeCard,
    fetchCurrentDayTimeCard,
    fetchTimeCards,
    fetchStatusCounts,
    timeCardPaginationData,
  ]);

  const endBreak = useCallback(async () => {
    if (!token || !user?.id || !currentActiveTimeCard) return false;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/timecard/breakend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to end break");
      }

      await fetchCurrentDayTimeCard();
      fetchTimeCards({
        page: timeCardPaginationData.current_page,
        perPage: timeCardPaginationData.per_page,
        date: timeCardPaginationData.date,
        ...(timeCardPaginationData.status && {
          status: timeCardPaginationData.status,
        }),
      });
      fetchStatusCounts();
      return true;
    } catch (err) {
      setError(err);
      console.error("End break error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    token,
    user?.id,
    currentActiveTimeCard,
    fetchCurrentDayTimeCard,
    fetchTimeCards,
    fetchStatusCounts,
    timeCardPaginationData,
  ]);

  const addLeaveStatus = useCallback(
    async (leaveData) => {
      if (!token) return false;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(LEAVE_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(leaveData),
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.errors
              ? JSON.stringify(errorData.errors)
              : errorData.message || "Failed to add leave status"
          );
        }

        fetchTimeCards({
          page: timeCardPaginationData.current_page,
          perPage: timeCardPaginationData.per_page,
          date: timeCardPaginationData.date, 
          ...(timeCardPaginationData.status && {
            status: timeCardPaginationData.status,
          }),
        });
        fetchStatusCounts();
        await fetchCurrentDayTimeCard();
        return true;
      } catch (err) {
        setError(err);
        console.error("Error adding leave status:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      token,
      fetchTimeCards,
      fetchStatusCounts,
      timeCardPaginationData,
      fetchCurrentDayTimeCard,
    ] // Added dependencies
  );

  const exportTimeCards = useCallback(
    async (type, filters) => {
      if (!token) {
        setError(new Error("Authentication token is missing."));
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/timecard/export-${type}?${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to export ${type}`);
        }

        const blob = await response.blob();
        const filename =
          response.headers.get("Content-Disposition")?.split("filename=")[1] ||
          `timecards.${type}`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename.replace(/"/g, "");
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return true;
      } catch (err) {
        setError(err);
        console.error(`Error exporting ${type}:`, err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchTimeCards();
    fetchStatusCounts();
    fetchCurrentDayTimeCard();
    fetchUsers();
  }, [
    token,
    user?.id,
    fetchTimeCards,
    fetchStatusCounts,
    fetchCurrentDayTimeCard,
    fetchUsers,
  ]);

  return (
    <TimeCardContext.Provider
      value={{
        timeCardPaginationData,
        timeCards: timeCardPaginationData.data,
        currentActiveTimeCard,
        loading,
        error,
        statusCounts,
        users,
        fetchTimeCards,
        addTimeCard,
        updateTimeCard,
        deleteTimeCard,
        fetchStatusCounts,
        clockIn,
        clockOut,
        startBreak,
        endBreak,
        addLeaveStatus,
        exportTimeCards,
      }}
    >
      {children}
    </TimeCardContext.Provider>
  );
};

export const useTimeCards = () => {
  const context = useContext(TimeCardContext);
  if (context === undefined) {
    throw new Error("useTimeCards must be used within a TimeCardProvider");
  }
  return context;
};

