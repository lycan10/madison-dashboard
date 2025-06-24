import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const [inventoryPaginationData, setInventoryPaginationData] = useState({
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
  const INVENTORY_API_URL = `${process.env.REACT_APP_BASE_URL}/api/inventories`;

  const fetchInventories = async (params = {}) => {
    if (!token) {
      setInventoryPaginationData({
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
      const response = await fetch(`${INVENTORY_API_URL}?${query}`, {
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
        throw new Error(errorData.message || "Failed to fetch inventory");
      }

      const data = await response.json();
      setInventoryPaginationData(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryStatusCounts = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/inventory/counts`,
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
        throw new Error("Failed to fetch inventory status counts");
      }
      const data = await response.json();
      setStatusCounts(data);
    } catch (err) {
      console.error("Error fetching inventory status counts:", err);
    }
  };

  const addInventory = async (inventoryData) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(INVENTORY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inventoryData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add inventory item");
      }

      const newInventory = await response.json();
      fetchInventories({
        page: inventoryPaginationData.current_page,
        perPage: inventoryPaginationData.per_page,
        ...(inventoryPaginationData.status && {
          status: inventoryPaginationData.status,
        }),
      });
      fetchInventoryStatusCounts();
      return newInventory;
    } catch (err) {
      setError(err);
      console.error("Error adding inventory item:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (id, inventoryData) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${INVENTORY_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inventoryData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update inventory item");
      }

      const updatedInventory = await response.json();
      fetchInventories({
        page: inventoryPaginationData.current_page,
        perPage: inventoryPaginationData.per_page,
        ...(inventoryPaginationData.status && {
          status: inventoryPaginationData.status,
        }),
      });
      fetchInventoryStatusCounts();
      return updatedInventory;
    } catch (err) {
      setError(err);
      console.error("Error updating inventory item:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteInventory = async (id) => {
    if (!token) return false;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${INVENTORY_API_URL}/${id}`, {
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
        throw new Error(errorData.message || "Failed to delete inventory item");
      }

      let newPage = inventoryPaginationData.current_page;
      if (inventoryPaginationData.data.length === 1 && newPage > 1) {
        newPage -= 1;
      }

      fetchInventories({
        page: newPage,
        perPage: inventoryPaginationData.per_page,
        ...(inventoryPaginationData.status && {
          status: inventoryPaginationData.status,
        }),
      });
      fetchInventoryStatusCounts();
      return true;
    } catch (err) {
      setError(err);
      console.error("Error deleting inventory item:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportInventories = async (format, params = {}) => {
    if (!token) {
      setError(new Error("Authentication token not available."));
      return;
    }

    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams(params).toString();
    const exportUrl = `${process.env.REACT_APP_BASE_URL}/api/inventory/export-${format}?${queryParams}`;

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
        let errorMessage = `Failed to export inventory as ${format}. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {}
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inventory_report.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err);
      console.error(`Error exporting inventory as ${format}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryStatusCounts();
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        inventoryPaginationData,
        inventories: inventoryPaginationData.data,
        loading,
        error,
        statusCounts,
        fetchInventories,
        addInventory,
        updateInventory,
        deleteInventory,
        fetchInventoryStatusCounts,
        exportInventories,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventories = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventories must be used within an InventoryProvider");
  }
  return context;
};
