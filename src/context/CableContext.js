import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CableContext = createContext(null);

export const CableProvider = ({ children }) => {
  const [cablePaginationData, setCablePaginationData] = useState({
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
  const [cableCounts, setCableCounts] = useState({});
  const { token } = useAuth();
  const CABLES_API_URL = `${process.env.REACT_APP_BASE_URL}/api/cables`;

  const fetchCables = async (params = {}) => {
    if (!token) {
      setCablePaginationData({
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
      const response = await fetch(`${CABLES_API_URL}?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          "Content-Type" : 'application/json'
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch cables");
      }

      const data = await response.json();
      setCablePaginationData(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching cables:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCableCounts = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/cable/counts`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch cable counts");
      }
      const data = await response.json();
      setCableCounts(data);
    } catch (err) {
      console.error("Error fetching cable counts:", err);
    }
  };

  const addCable = async (cableData) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(CABLES_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify(cableData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add cable");
      }

      const newCable = await response.json();
      fetchCables({
        page: cablePaginationData.current_page,
        perPage: cablePaginationData.per_page,
        ...(cablePaginationData.progress && {
          progress: cablePaginationData.progress,
        }),
      });
      fetchCableCounts();
      return newCable;
    } catch (err) {
      setError(err);
      console.error("Error adding cable:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCable = async (id, cableData) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${CABLES_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify(cableData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update cable");
      }

      const updatedCable = await response.json();
      fetchCables({
        page: cablePaginationData.current_page,
        perPage: cablePaginationData.per_page,
        ...(cablePaginationData.progress && {
          progress: cablePaginationData.progress,
        }),
      });
      fetchCableCounts();
      return updatedCable;
    } catch (err) {
      setError(err);
      console.error("Error updating cable:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCable = async (id) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${CABLES_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete cable");
      }

      let newPage = cablePaginationData.current_page;
      if (cablePaginationData.data.length === 1 && newPage > 1) {
        newPage -= 1;
      }

      fetchCables({
        page: newPage,
        perPage: cablePaginationData.per_page,
        ...(cablePaginationData.progress && {
          progress: cablePaginationData.progress,
        }),
      });
      fetchCableCounts();
      return true;
    } catch (err) {
      setError(err);
      console.error("Error deleting cable:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportCables = async (format, params = {}) => {
    if (!token) {
      setError(new Error("Authentication token not available."));
      return;
    }

    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams(params).toString();
    const exportUrl = `${process.env.REACT_APP_BASE_URL}/api/cable/export-${format}?${queryParams}`;

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
        let errorMessage = `Failed to export cables as ${format}. Status: ${response.status}`;
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
      a.download = `cables_report.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err);
      console.error(`Error exporting cables as ${format}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCables();
    fetchCableCounts();
  }, [token]);

  return (
    <CableContext.Provider
      value={{
        cablePaginationData,
        cables: cablePaginationData.data,
        loading,
        error,
        cableCounts,
        fetchCables,
        addCable,
        updateCable,
        deleteCable,
        fetchCableCounts,
        exportCables,
      }}
    >
      {children}
    </CableContext.Provider>
  );
};

export const useCables = () => {
  const context = useContext(CableContext);
  if (!context) {
    throw new Error("useCables must be used within a CableProvider");
  }
  return context;
};

