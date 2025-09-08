import React, { useState, useEffect } from "react";
import "../order/order.css";
import "../overview/overview.css";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FireIcon,
  Tag01FreeIcons,
  WaterEnergyFreeIcons,
  TractorFreeIcons,
  Calendar01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import OverviewCard from "../../components/overviewCard/OverviewCard";
import { PieChart } from "react-minimal-pie-chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useOverview } from "../../context/OverviewContext";

const Overview = () => {
  const {
    overviewData,
    loading,
    error,
    dateRange,
    updateDateRange,
    fetchOverviewData,
    getTotals,
    getTaskOverviewData,
    getPresetRanges
  } = useOverview();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDateRange, setTempDateRange] = useState(dateRange);

  useEffect(() => {
    setTempDateRange(dateRange);
  }, [dateRange]);

  const totals = getTotals();
  const taskOverviewData = getTaskOverviewData();
  const presetRanges = getPresetRanges();

  const getPercentageChange = (current, previous = 0) => {
    if (previous === 0) return "+0.0";
    const change = ((current - previous) / previous * 100).toFixed(1);
    return change > 0 ? `+${change}` : change.toString();
  };

  const handlePresetRange = (rangeName) => {
    const range = presetRanges[rangeName];
    updateDateRange(range.startDate, range.endDate);
    setShowDatePicker(false);
  };

  const handleDateRangeSubmit = () => {
    updateDateRange(tempDateRange.startDate, tempDateRange.endDate);
    setShowDatePicker(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleRefresh = () => {
    fetchOverviewData();
  };

  const renderPieChart = (data, total, title) => {
    if (!data || data.length === 0) {
      return (
        <div className="empty-state">
          <p>No {title.toLowerCase()} data for selected period</p>
        </div>
      );
    }

    return (
      <>
        <PieChart
          data={data}
          animate
          animationDuration={500}
          label={({ dataEntry }) =>
            total > 0 
              ? `${Math.round((dataEntry.value / total) * 100)}%`
              : '0%'
          }
          labelStyle={{
            fontSize: "5px",
            fontFamily: "sans-serif",
            fill: "#fff",
            fontWeight: "bold",
          }}
          labelPosition={70}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#2c3e50",
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "50%",
            minWidth: "80px",
            minHeight: "80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: "700" }}>{total}</span>
          <span style={{ fontSize: "12px", opacity: 0.7 }}>Total</span>
        </div>
      </>
    );
  };

  const renderLegend = (data) => {
    if (!data || data.length === 0) return null;

    return (
      <div className="chart-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color"
              style={{ backgroundColor: item.color }} 
            />
            <span>{item.title}: {item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="order-page">
        <div className="rightsidebar-navbar">
          <h3>Overview</h3>
        </div>
        <div className="order-table-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            flexDirection: 'column'
          }}>
            <div className="loading-spinner" />
            <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '16px' }}>
              Loading overview data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-page">
        <div className="rightsidebar-navbar">
          <h3>Overview</h3>
        </div>
        <div className="order-table-container">
          <div className="error-state" style={{ height: '50vh' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Error loading data</h3>
            <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>{error}</p>
            <button 
              onClick={handleRefresh}
              className="btn-primary"
              style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="rightsidebar-navbar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h3>Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="date-picker-button"
              >
                <HugeiconsIcon icon={Calendar01Icon} size={16} />
                <span>{formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}</span>
              </button>

              {showDatePicker && (
                <div className="date-picker-dropdown">
                  <div className="preset-ranges">
                    <h4>Quick Select</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {Object.keys(presetRanges).map((rangeName) => (
                        <button
                          key={rangeName}
                          onClick={() => handlePresetRange(rangeName)}
                          className="preset-button"
                        >
                          {rangeName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="custom-range">
                    <h4>Custom Range</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '13px', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          From:
                        </label>
                        <input
                          type="date"
                          value={tempDateRange.startDate}
                          onChange={(e) => setTempDateRange({...tempDateRange, startDate: e.target.value})}
                          className="date-input"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          To:
                        </label>
                        <input
                          type="date"
                          value={tempDateRange.endDate}
                          onChange={(e) => setTempDateRange({...tempDateRange, endDate: e.target.value})}
                          className="date-input"
                        />
                      </div>
                      <div className="date-actions">
                        <button
                          onClick={handleDateRangeSubmit}
                          className="btn-primary"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              className="refresh-button"
              title="Refresh Data"
              disabled={loading}
            >
              <HugeiconsIcon icon={RefreshIcon} size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="order-table-container">
        <div className="overview-card-main-container">
          <div className="overview-cable-container">
            <OverviewCard
              icon={TractorFreeIcons}
              title={"Cables"}
              value={totals.cables}
              percentage={getPercentageChange(totals.cables)}
            />
            <OverviewCard
              icon={WaterEnergyFreeIcons}
              title={"Hydraulic Hose"}
              value={totals.hoses}
              percentage={getPercentageChange(totals.hoses)}
            />
            <OverviewCard
              icon={Tag01FreeIcons}
              title={"Starters/Alternators"}
              value={totals.alternators}
              percentage={getPercentageChange(totals.alternators)}
            />
            <OverviewCard
              icon={FireIcon}
              title={"All"}
              value={totals.all}
              percentage={getPercentageChange(totals.all)}
            />
          </div>

          <div className="overview-piechart">

            <div className="piechart-cable">
              <h1>Cables</h1>
              <div className="piechart-circle">
                {renderPieChart(overviewData.cables.chartData, overviewData.cables.total, "cables")}
              </div>
              {renderLegend(overviewData.cables.chartData)}
            </div>

            <div className="piechart-cable">
              <h1>Hydraulic Hose</h1>
              <div className="piechart-circle">
                {renderPieChart(overviewData.hoses.chartData, overviewData.hoses.total, "hoses")}

              </div>
              {renderLegend(overviewData.hoses.chartData)}
            </div>

            <div className="piechart-cable">
              <h1>Starter/Alternators</h1>
              <div className="piechart-circle">
                {renderPieChart(overviewData.alternators.chartData, overviewData.alternators.total, "alternators")}
              </div>
              {renderLegend(overviewData.alternators.chartData)}
            </div>
          </div>

          <div className="bar-graph" style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <BarChart
                data={taskOverviewData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#Ffac1f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {showDatePicker && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0,0,0,0.1)'
          }}
          onClick={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};

export default Overview;