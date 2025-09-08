import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const OverviewContext = createContext(null);

export const OverviewProvider = ({ children }) => {
  const { token, logout } = useAuth();
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [overviewData, setOverviewData] = useState({
    cables: {
      counts: {},
      total: 0,
      chartData: [],
      dailyCounts: [],
      analytics: {}
    },
    hoses: {
      counts: {},
      total: 0,
      chartData: [],
      dailyCounts: [],
      analytics: {}
    },
    alternators: {
      counts: {},
      total: 0,
      chartData: [],
      dailyCounts: [],
      analytics: {}
    },
    tasks: {
      counts: {},
      total: 0,
      chartData: [],
      dailyCounts: [],
      analytics: {}
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildQueryParams = useCallback((additionalParams = {}) => {
    const params = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      ...additionalParams
    });
    return params.toString();
  }, [dateRange.startDate, dateRange.endDate]);

  const fetchCounts = useCallback(async () => {
    if (!token) return {};

    try {
      const [cablesResponse, hosesResponse, alternatorsResponse, tasksResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_BASE_URL}/api/cables/counts?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BASE_URL}/api/hoses/counts?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BASE_URL}/api/alternators/counts?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BASE_URL}/api/tasks/counts?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if ([cablesResponse, hosesResponse, alternatorsResponse, tasksResponse].some(res => res.status === 401)) {
        logout();
        return {};
      }

      if (![cablesResponse, hosesResponse, alternatorsResponse, tasksResponse].every(res => res.ok)) {
        throw new Error("Failed to fetch counts data");
      }

      const [cablesData, hosesData, alternatorsData, tasksData] = await Promise.all([
        cablesResponse.json(),
        hosesResponse.json(),
        alternatorsResponse.json(),
        tasksResponse.json()
      ]);

      return {
        cables: cablesData,
        hoses: hosesData,
        alternators: alternatorsData,
        tasks: tasksData
      };
    } catch (error) {
      console.error("Error fetching counts:", error);
      throw error;
    }
  }, [token, logout, buildQueryParams]);

  const fetchChartData = useCallback(async () => {
    if (!token) return {};

    try {
      const [cablesResponse, hosesResponse, alternatorsResponse, tasksResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_BASE_URL}/api/cables/chart-data?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BASE_URL}/api/hoses/chart-data?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BASE_URL}/api/alternators/chart-data?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BASE_URL}/api/tasks/chart-data?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if ([cablesResponse, hosesResponse, alternatorsResponse, tasksResponse].some(res => res.status === 401)) {
        logout();
        return {};
      }

      if (![cablesResponse, hosesResponse, alternatorsResponse, tasksResponse].every(res => res.ok)) {
        throw new Error("Failed to fetch chart data");
      }

      const [cablesData, hosesData, alternatorsData, tasksData] = await Promise.all([
        cablesResponse.json(),
        hosesResponse.json(),
        alternatorsResponse.json(),
        tasksResponse.json()
      ]);

      return {
        cables: cablesData,
        hoses: hosesData,
        alternators: alternatorsData,
        tasks: tasksData
      };
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw error;
    }
  }, [token, logout, buildQueryParams]);

  const fetchAnalytics = useCallback(async () => {
    if (!token) return {};

    try {
      const [cablesResponse, hosesResponse, alternatorsResponse, tasksResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_BASE_URL}/api/cables/analytics?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BASE_URL}/api/hoses/analytics?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BASE_URL}/api/alternators/analytics?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BASE_URL}/api/tasks/analytics?${buildQueryParams()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if ([cablesResponse, hosesResponse, alternatorsResponse, tasksResponse].some(res => res.status === 401)) {
        logout();
        return {};
      }

      if (![cablesResponse, hosesResponse, alternatorsResponse, tasksResponse].every(res => res.ok)) {
        throw new Error("Failed to fetch analytics data");
      }

      const [cablesData, hosesData, alternatorsData, tasksData] = await Promise.all([
        cablesResponse.json(),
        hosesResponse.json(),
        alternatorsResponse.json(),
        tasksResponse.json()
      ]);

      return {
        cables: cablesData,
        hoses: hosesData,
        alternators: alternatorsData,
        tasks: tasksData
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }, [token, logout, buildQueryParams]);

  const fetchOverviewData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [countsData, chartData, analyticsData] = await Promise.all([
        fetchCounts(),
        fetchChartData(),
        fetchAnalytics()
      ]);

      const processedData = {
        cables: {
          counts: countsData.cables || {},
          total: chartData.cables?.total || 0,
          chartData: chartData.cables?.status_breakdown || [],
          dailyCounts: chartData.cables?.daily_counts || [],
          analytics: analyticsData.cables || {}
        },
        hoses: {
          counts: countsData.hoses || {},
          total: chartData.hoses?.total || 0,
          chartData: chartData.hoses?.status_breakdown || [],
          dailyCounts: chartData.hoses?.daily_counts || [],
          analytics: analyticsData.hoses || {}
        },
        alternators: {
          counts: countsData.alternators || {},
          total: chartData.alternators?.total || 0,
          chartData: chartData.alternators?.status_breakdown || [],
          dailyCounts: chartData.alternators?.daily_counts || [],
          analytics: analyticsData.alternators || {}
        },
        tasks: {
          counts: countsData.tasks || {},
          total: chartData.tasks?.total || 0,
          chartData: chartData.tasks?.status_breakdown || [],
          dailyCounts: chartData.tasks?.daily_counts || [],
          analytics: analyticsData.tasks || {}
        }
      };

      setOverviewData(processedData);
    } catch (err) {
      console.error("Fetch overview data error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, fetchCounts, fetchChartData, fetchAnalytics]);

  const updateDateRange = useCallback((startDate, endDate) => {
    setDateRange({ startDate, endDate });
  }, []);

  const getTotals = useCallback(() => {
    return {
      cables: overviewData.cables.total,
      hoses: overviewData.hoses.total,
      alternators: overviewData.alternators.total,
      tasks: overviewData.tasks.total,
      all: overviewData.cables.total + overviewData.hoses.total + overviewData.alternators.total
    };
  }, [overviewData]);

  const getTaskOverviewData = useCallback(() => {
    if (overviewData.tasks.analytics?.bar_chart_data) {
      return overviewData.tasks.analytics.bar_chart_data;
    }
    const taskCounts = overviewData.tasks.counts;
    return [
      { title: "New tasks", value: taskCounts["New Task"] || 0 },
      { title: "Tasks in progress", value: taskCounts["In Progress"] || 0 },
      { title: "Overdue tasks", value: taskCounts["Overdue"] || 0 },
      { title: "Completed tasks", value: taskCounts["Completed"] || 0 },
      { title: "Pending review", value: taskCounts["Pending Review"] || 0 },
      { title: "On hold", value: taskCounts["On Hold"] || 0 },
      { title: "Cancelled", value: taskCounts["Cancelled"] || 0 },
    ];
  }, [overviewData.tasks]);

  const getPresetRanges = useCallback(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);
    
    const lastQuarter = new Date(today);
    lastQuarter.setDate(lastQuarter.getDate() - 90);

    return {
      'Today': {
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      'Yesterday': {
        startDate: yesterday.toISOString().split('T')[0],
        endDate: yesterday.toISOString().split('T')[0]
      },
      'Last 7 Days': {
        startDate: lastWeek.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      'Last 30 Days': {
        startDate: lastMonth.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      'Last 90 Days': {
        startDate: lastQuarter.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      }
    };
  }, []);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  return (
    <OverviewContext.Provider
      value={{
        overviewData,
        loading,
        error,
        dateRange,
        fetchOverviewData,
        updateDateRange,
        getTotals,
        getTaskOverviewData,
        getPresetRanges
      }}
    >
      {children}
    </OverviewContext.Provider>
  );
};

export const useOverview = () => useContext(OverviewContext);
