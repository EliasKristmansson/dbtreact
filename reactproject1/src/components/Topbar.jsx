import React from "react";
import "../App.css";
import { X } from "lucide-react";

export default function Topbar({ projectName, deadline = "Ingen deadline", priority = "medium", tabs, activeTabId, onTabClick, onTabClose }) {
  return (
    <div className="topbar">
      <div className="topbar-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? "active-tab" : ""}`}
            onClick={() => onTabClick(tab.id)}
          >
            {tab.name}
            <button
              title="Stäng projekt"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className="close-button"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="topbar-content-right">
        <div className={`priority-indicator ${priority}`} aria-label={`Priority: ${priority}`} />
        <h2 className="project-name">{projectName}</h2>

        <div className="project-meta">
          <p className="project-other">Deadline: <span>{deadline}</span></p>
          <p className="project-other">0/100 prover klara</p>
          <p className="project-other">0 Kommentarer</p>
        </div>
      </div>
    </div>
  );
}
