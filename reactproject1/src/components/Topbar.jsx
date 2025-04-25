import React, { useState } from "react";
import "../App.css"; // or wherever your CSS
import { X } from "lucide-react";

export default function Topbar({ projectName, priority = "medium" }) {
  // Håll reda på vilka flikar som är öppna
  const [tabs, setTabs] = useState([
    { id: 1, name: "Projekt 1" },
    { id: 2, name: "Projekt 2" },
    { id: 3, name: "Projekt 3" },
  ]);

  // Hantera stängning av flik
  const handleTabClose = (id) => {
    setTabs(tabs.filter((tab) => tab.id !== id));
  };

  return (
    <div className="topbar">
      <div className="topbar-content">
        {/* Rendera alla tabbar dynamiskt */}
        {tabs.map((tab) => (
          <div key={tab.id} className="tab">
            {tab.name}
            <button
              onClick={() => handleTabClose(tab.id)}
              className="close-button"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="topbar-content-right">
        <div className={`priority-indicator ${priority}`} aria-label={`Priority: ${priority}`}></div>
        <h2 className="project-name">{projectName}</h2>

        <div className="project-meta">
          <p className="project-other">Deadline: </p>
          <p className="project-other">0/100 prover klara</p>
          <p className="project-other">0 Kommentarer </p>
        </div>
      </div>
    </div>
  );
}
