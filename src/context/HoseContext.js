import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const HoseContext = createContext(null);

export const HoseProvider = ({ children }) => {
  const [hosePaginationData, setHosePaginationData] = useState({
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
  const [hoseCounts, setHoseCounts] = useState({});
  const { token } = useAuth();
  const HOSES_API_URL = `${process.env.REACT_APP_BASE_URL}/api/hoses`;

  const fetchHoses = async (params = {}) => {
    if (!token) {
      setHosePaginationData({
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
      const response = await fetch(`${HOSES_API_URL}?${query}`, {
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
        throw new Error(errorData.message || "Failed to fetch hoses");
      }

      const data = await response.json();
      setHosePaginationData(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching hoses:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHoseCounts = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/hose/counts`,
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
        throw new Error("Failed to fetch hose counts");
      }
      const data = await response.json();
      setHoseCounts(data);
    } catch (err) {
      console.error("Error fetching hose counts:", err);
    }
  };

  const addHose = async (hoseData) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(HOSES_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(hoseData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add hose");
      }

      const newHose = await response.json();
      fetchHoses({
        page: hosePaginationData.current_page,
        perPage: hosePaginationData.per_page,
        ...(hosePaginationData.progress && {
          progress: hosePaginationData.progress,
        }),
      });
      fetchHoseCounts();
      return newHose;
    } catch (err) {
      setError(err);
      console.error("Error adding hose:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateHose = async (id, hoseData) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${HOSES_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(hoseData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update hose");
      }

      const updatedHose = await response.json();
      fetchHoses({
        page: hosePaginationData.current_page,
        perPage: hosePaginationData.per_page,
        ...(hosePaginationData.progress && {
          progress: hosePaginationData.progress,
        }),
      });
      fetchHoseCounts();
      return updatedHose;
    } catch (err) {
      setError(err);
      console.error("Error updating hose:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteHose = async (id) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${HOSES_API_URL}/${id}`, {
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
        throw new Error(errorData.message || "Failed to delete hose");
      }

      let newPage = hosePaginationData.current_page;
      if (hosePaginationData.data.length === 1 && newPage > 1) {
        newPage -= 1;
      }

      fetchHoses({
        page: newPage,
        perPage: hosePaginationData.per_page,
        ...(hosePaginationData.progress && {
          progress: hosePaginationData.progress,
        }),
      });
      fetchHoseCounts();
      return true;
    } catch (err) {
      setError(err);
      console.error("Error deleting hose:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportHoses = async (format, params = {}) => {
    if (!token) {
      setError(new Error("Authentication token not available."));
      return;
    }

    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams(params).toString();
    const exportUrl = `${process.env.REACT_APP_BASE_URL}/api/hose/export-${format}?${queryParams}`;

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
        let errorMessage = `Failed to export hoses as ${format}. Status: ${response.status}`;
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
      a.download = `hoses_report.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err);
      console.error(`Error exporting hoses as ${format}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoses();
    fetchHoseCounts();
  }, [token]);

  return (
    <HoseContext.Provider
      value={{
        hosePaginationData,
        hoses: hosePaginationData.data,
        loading,
        error,
        hoseCounts,
        fetchHoses,
        addHose,
        updateHose,
        deleteHose,
        fetchHoseCounts,
        exportHoses,
      }}
    >
      {children}
    </HoseContext.Provider>
  );
};

export const useHoses = () => {
  const context = useContext(HoseContext);
  if (!context) {
    throw new Error("useHoses must be used within a HoseProvider");
  }
  return context;
};