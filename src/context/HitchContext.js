import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const HitchContext = createContext(null);

export const HitchProvider = ({ children }) => {
  const [hitchPaginationData, setHitchPaginationData] = useState({
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
  const [statusCounts, setStatusCounts] = useState({});
  const { token } = useAuth();
  const HITCH_API_URL = `${process.env.REACT_APP_BASE_URL}/api/hitches`;

  const fetchHitches = async (params = {}) => {
    if (!token) {
      setHitchPaginationData({
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
      const response = await fetch(`${HITCH_API_URL}?${query}`, {
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
        throw new Error(errorData.message || "Failed to fetch hitch requests");
      }

      const data = await response.json();
      setHitchPaginationData(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching hitch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHitchStatusCounts = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/hitch/counts`,
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
        throw new Error("Failed to fetch hitch status counts");
      }
      const data = await response.json();
      setStatusCounts(data);
    } catch (err) {
      console.error("Error fetching hitch status counts:", err);
    }
  };

  const addHitch = async (hitchData) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(HITCH_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(hitchData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add hitch request");
      }

      const newHitch = await response.json();
      fetchHitches({
        page: hitchPaginationData.current_page,
        perPage: hitchPaginationData.per_page,
        ...(hitchPaginationData.status && {
          status: hitchPaginationData.status,
        }),
      });
      fetchHitchStatusCounts();
      return newHitch;
    } catch (err) {
      setError(err);
      console.error("Error adding hitch request:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateHitch = async (id, hitchData) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${HITCH_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(hitchData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update hitch request");
      }

      const updatedHitch = await response.json();
      fetchHitches({
        page: hitchPaginationData.current_page,
        perPage: hitchPaginationData.per_page,
        ...(hitchPaginationData.status && {
          status: hitchPaginationData.status,
        }),
      });
      fetchHitchStatusCounts();
      return updatedHitch;
    } catch (err) {
      setError(err);
      console.error("Error updating hitch request:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteHitch = async (id) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${HITCH_API_URL}/${id}`, {
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
        throw new Error(errorData.message || "Failed to delete hitch request");
      }

      let newPage = hitchPaginationData.current_page;
      if (hitchPaginationData.data.length === 1 && newPage > 1) {
        newPage -= 1;
      }

      fetchHitches({
        page: newPage,
        perPage: hitchPaginationData.per_page,
        ...(hitchPaginationData.status && {
          status: hitchPaginationData.status,
        }),
      });
      fetchHitchStatusCounts();
      return true;
    } catch (err) {
      setError(err);
      console.error("Error deleting hitch request:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHitches();
    fetchHitchStatusCounts();
  }, [token]);

  return (
    <HitchContext.Provider
      value={{
        hitchPaginationData,
        hitches: hitchPaginationData.data,
        loading,
        error,
        statusCounts,
        fetchHitches,
        addHitch,
        updateHitch,
        deleteHitch,
        fetchHitchStatusCounts,
      }}
    >
      {children}
    </HitchContext.Provider>
  );
};

export const useHitches = () => {
  const context = useContext(HitchContext);
  if (!context) {
    throw new Error("useHitches must be used within a HitchProvider");
  }
  return context;
};
