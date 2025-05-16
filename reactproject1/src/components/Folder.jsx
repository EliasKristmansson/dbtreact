import React, { useState } from "react";
import Project from "./Project";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function Folder({ title, projects, onProjectDoubleClick, onProjectDelete, onProjectRename, activeTabId, tabs, isOpen, toggleFolder}) {
  
  const isActive = (projectId) => {
    const tab = tabs.find(t => t.id === projectId);
    return tab && tab.id === activeTabId;
  };
  console.log(tabs)
  return (
    <div className="folder">
      <div className="collapse-container" onClick={toggleFolder}>
        <span>{isOpen ? <ChevronDown className="chevron" strokeWidth={0.8}/> : <ChevronRight className="chevron" strokeWidth={0.8}/>}</span>
        <h4 className="folder-title">{title}</h4>
      </div>

      {isOpen && (
        <div className="project">
          {projects.map((proj, idx) => (
            
            <Project
              key={idx}
              name={proj.name}
              className={`project-item ${isActive(proj.id) ? "active" : ""}`}
              onDoubleClick={onProjectDoubleClick}
              onDelete={() => onProjectDelete(idx)}
              onRename={(oldName, newName) => onProjectRename(title, oldName, newName)}
            />
          ))}
        </div>
      )}
    </div>
  );
}