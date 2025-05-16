import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function groupBy(data, periodFn) {
  const grouped = {};
  data.forEach(item => {
    const key = periodFn(new Date(item.date));
    grouped[key] = (grouped[key] || 0) + 1;
  });
  return Object.entries(grouped).map(([key, count]) => ({ period: key, count }));
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">{label}</p>
        <div className="custom-tooltip-value">
          <span></span>
          <span>{`${payload[0].value} projekt`}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function Statistik({ onBack }) {
  const [view, setView] = useState("week");
  const [data, setData] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("completedProjects") || "[]");
    const formatter = {
      week: (date) => {
        const week = Math.ceil((date.getDate() - date.getDay() + 1) / 7);
        return `${date.getFullYear()} v${week}`;
      },
      month: (date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`,
      year: (date) => `${date.getFullYear()}`
    };
    setData(groupBy(raw, formatter[view]));
  }, [view]);

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <h2>Statistik över avklarade projekt</h2>
      </div>
      
      <div className="control-bar">
        <div className="view-buttons">
          <button 
            className={`view-button ${view === "week" ? "active" : ""}`} 
            onClick={() => setView("week")}
          >
            Veckovis
          </button>
          <button 
            className={`view-button ${view === "month" ? "active" : ""}`} 
            onClick={() => setView("month")}
          >
            Månadsvis
          </button>
          <button 
            className={`view-button ${view === "year" ? "active" : ""}`} 
            onClick={() => setView("year")}
          >
            Årsvis
          </button>
        </div>
        
        <button className="back-button" onClick={onBack}>
          ⬅ <span>Tillbaka</span>
        </button>
      </div>
      
      <div className="chart-container">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="period" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#2196f3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-text">
              Inga avklarade projekt ännu. Avsluta projekt för att visa statistik här.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}