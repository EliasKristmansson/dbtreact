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
    <div style={{ padding: "2rem" }}>
      <h2>Statistik över avklarade projekt</h2>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("week")}>Veckovis</button>
        <button onClick={() => setView("month")}>Månadsvis</button>
        <button onClick={() => setView("year")}>Årsvis</button>
        <button onClick={onBack} style={{ marginLeft: "1rem" }}>⬅ Tillbaka</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="period" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#2196f3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
