import React from "react";
import "../App.css"; // eller var din CSS ligger
import { X } from "lucide-react";

export default function Topbar({ projectName, priority = "medium", tabs, onTabClose }) {
  return (
    <div className="topbar">
      <div className="topbar-content">
        {/* Rendera alla tabbar dynamiskt */}
        {tabs.map((tab) => (
          <div key={tab.id} className="tab">
            {tab.name}
            <button
              onClick={() => onTabClose(tab.id)}
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
