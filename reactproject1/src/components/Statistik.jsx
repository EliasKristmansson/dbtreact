// Statistik.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";

function groupBy(data, periodFn) {
  const grouped = {};
  data.forEach(item => {
    const key = periodFn(new Date(item.date));
    grouped[key] = (grouped[key] || 0) + 1;
  });
  return Object.entries(grouped)
    .map(([key, count]) => ({ period: key, count }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

const getISOWeek = (date) => {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return (
    tempDate.getFullYear() +
    " v" +
    String(1 + Math.round(((tempDate - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7))
  );
};

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
  const [chartType, setChartType] = useState("bar");
  const [timeRange, setTimeRange] = useState("all");

  const colorMap = {
    week: "#4caf50",
    month: "#2196f3",
    year: "#ff9800"
  };

  const sampleProjects = [
    { date: "2024-03-01", name: "Projekt A" },
    { date: "2024-03-05", name: "Projekt B" },
    { date: "2024-03-10", name: "Projekt C" },
    { date: "2024-04-02", name: "Projekt D" },
    { date: "2024-04-15", name: "Projekt E" },
    { date: "2024-04-22", name: "Projekt F" },
    { date: "2024-05-01", name: "Projekt G" },
    { date: "2024-05-12", name: "Projekt H" },
    { date: "2024-05-20", name: "Projekt I" },
    { date: "2024-06-03", name: "Projekt J" },
    { date: "2024-06-10", name: "Projekt K" },
    { date: "2024-07-04", name: "Projekt L" },
    { date: "2024-07-18", name: "Projekt M" },
    { date: "2024-08-05", name: "Projekt N" },
    { date: "2024-08-22", name: "Projekt O" },
    { date: "2024-09-01", name: "Projekt P" },
    { date: "2024-09-16", name: "Projekt Q" },
    { date: "2024-09-30", name: "Projekt R" },
    { date: "2024-10-05", name: "Projekt S" },
    { date: "2024-10-15", name: "Projekt T" },
    { date: "2024-10-28", name: "Projekt U" },
    { date: "2024-11-03", name: "Projekt V" },
    { date: "2024-11-12", name: "Projekt W" },
    { date: "2024-12-01", name: "Projekt X" },
    { date: "2024-12-17", name: "Projekt Y" }
  ];

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("completedProjects") || "[]");
    const combinedProjects = [...sampleProjects, ...storedProjects];

    const filterByTimeRange = (projects) => {
      if (timeRange === "all") return projects;
      const now = new Date();
      let startDate = new Date();

      if (timeRange === "3months") startDate.setMonth(now.getMonth() - 3);
      if (timeRange === "year") startDate.setFullYear(now.getFullYear() - 1);

      return projects.filter(p => new Date(p.date) >= startDate);
    };

    const formatter = {
      week: getISOWeek,
      month: (date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`,
      year: (date) => `${date.getFullYear()}`
    };

    const filtered = filterByTimeRange(combinedProjects);
    setData(groupBy(filtered, formatter[view]));
  }, [view, timeRange]);

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const maxPeriod = data.reduce((max, d) => d.count > max.count ? d : max, { count: 0 });

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <h2>Statistik över avklarade projekt</h2>
      </div>

      <div className="summary">
        <p>Totalt antal projekt: <strong>{total}</strong></p>
        {maxPeriod.count > 0 && (
          <p>Mest aktiva period: <strong>{maxPeriod.period} ({maxPeriod.count} projekt)</strong></p>
        )}
      </div>

      <div className="control-bar">
        <div className="view-buttons">
          <button className={view === "week" ? "active" : ""} onClick={() => setView("week")}>Veckovis</button>
          <button className={view === "month" ? "active" : ""} onClick={() => setView("month")}>Månadsvis</button>
          <button className={view === "year" ? "active" : ""} onClick={() => setView("year")}>Årsvis</button>
        </div>

        <div className="chart-toggle">
          <button className={chartType === "bar" ? "active" : ""} onClick={() => setChartType("bar")}>Stapeldiagram</button>
          <button className={chartType === "line" ? "active" : ""} onClick={() => setChartType("line")}>Linjediagram</button>
        </div>

        <div className="time-range-buttons">
          <button className={timeRange === "all" ? "active" : ""} onClick={() => setTimeRange("all")}>Alla</button>
          <button className={timeRange === "3months" ? "active" : ""} onClick={() => setTimeRange("3months")}>Senaste 3 mån</button>
          <button className={timeRange === "year" ? "active" : ""} onClick={() => setTimeRange("year")}>Senaste året</button>
        </div>

        <button className="back-button" onClick={onBack}>⬅ <span>Tillbaka</span></button>
      </div>

      <div className="chart-container">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={data}>
                <XAxis dataKey="period" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill={colorMap[view]} isAnimationActive={true} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={data}>
                <XAxis dataKey="period" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke={colorMap[view]} strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            )}
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
