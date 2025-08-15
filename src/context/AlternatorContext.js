import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const AlternatorContext = createContext(null);

export const AlternatorProvider = ({ children }) => {
  const [alternatorPaginationData, setAlternatorPaginationData] = useState({
    current_page: 1,
    data: [],
    first_page_url: null,
    from: null,
    last_page: 1,
    last_page_url: null,
    links: [],
    next_page_url: null,
    path: null,
    per_page: 10,
    prev_page_url: null,
    to: null,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alternatorCounts, setAlternatorCounts] = useState({});
  const { token } = useAuth();
  const ALTERNATORS_API_URL = `${process.env.REACT_APP_BASE_URL}/api/alternators`;

  const fetchAlternators = async (params = {}) => {
    if (!token) {
      setAlternatorPaginationData({
        current_page: 1,
        data: [],
        first_page_url: null,
        from: null,
        last_page: 1,
        last_page_url: null,
        links: [],
        next_page_url: null,
        path: null,
        per_page: 10,
        prev_page_url: null,
        to: null,
        total: 0,
      });
      return;
    }

    setLoading(true);
    setError(null);

    const query = new URLSearchParams(params).toString();
    try {
      const response = await fetch(`${ALTERNATORS_API_URL}?${query}`, {
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
        throw new Error(errorData.message || "Failed to fetch alternators");
      }

      const data = await response.json();
      setAlternatorPaginationData(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching alternators:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlternatorCounts = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/alternator/counts`,
        {
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
        throw new Error("Failed to fetch alternator counts");
      }
      const data = await response.json();
      setAlternatorCounts(data);
    } catch (err) {
      console.error("Error fetching alternator counts:", err);
    }
  };

  const addAlternator = async (alternatorData) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(ALTERNATORS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(alternatorData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add alternator");
      }

      const newAlternator = await response.json();
      fetchAlternators({
        page: alternatorPaginationData.current_page,
        perPage: alternatorPaginationData.per_page,
        ...(alternatorPaginationData.progress && {
          progress: alternatorPaginationData.progress,
        }),
      });
      fetchAlternatorCounts();
      return newAlternator;
    } catch (err) {
      setError(err);
      console.error("Error adding alternator:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAlternator = async (id, alternatorData) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${ALTERNATORS_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(alternatorData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update alternator");
      }

      const updatedAlternator = await response.json();
      fetchAlternators({
        page: alternatorPaginationData.current_page,
        perPage: alternatorPaginationData.per_page,
        ...(alternatorPaginationData.progress && {
          progress: alternatorPaginationData.progress,
        }),
      });
      fetchAlternatorCounts();
      return updatedAlternator;
    } catch (err) {
      setError(err);
      console.error("Error updating alternator:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlternator = async (id) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${ALTERNATORS_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete alternator");
      }

      let newPage = alternatorPaginationData.current_page;
      if (alternatorPaginationData.data.length === 1 && newPage > 1) {
        newPage -= 1;
      }

      fetchAlternators({
        page: newPage,
        perPage: alternatorPaginationData.per_page,
        ...(alternatorPaginationData.progress && {
          progress: alternatorPaginationData.progress,
        }),
      });
      fetchAlternatorCounts();
      return true;
    } catch (err) {
      setError(err);
      console.error("Error deleting alternator:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportAlternators = async (format, params = {}) => {
    if (!token) {
      setError(new Error("Authentication token not available."));
      return;
    }

    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams(params).toString();
    const exportUrl = `${process.env.REACT_APP_BASE_URL}/api/alternator/export-${format}?${queryParams}`;

    try {
      const response = await fetch(exportUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        let errorMessage = `Failed to export alternators as ${format}. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `alternators_report.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err);
      console.error(`Error exporting alternators as ${format}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlternators();
    fetchAlternatorCounts();
  }, [token]);

  return (
    <AlternatorContext.Provider
      value={{
        alternatorPaginationData,
        alternators: alternatorPaginationData.data,
        loading,
        error,
        alternatorCounts,
        fetchAlternators,
        addAlternator,
        updateAlternator,
        deleteAlternator,
        fetchAlternatorCounts,
        exportAlternators,
      }}
    >
      {children}
    </AlternatorContext.Provider>
  );
};

export const useAlternators = () => {
  const context = useContext(AlternatorContext);
  if (!context) {
    throw new Error("useAlternators must be used within an AlternatorProvider");
  }
  return context;
};