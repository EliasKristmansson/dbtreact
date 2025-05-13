import React, { useState } from "react";
import Project from "./Project";
import {ChevronRight, ChevronDown} from "lucide-react";

export default function Folder({ title, projects, onProjectDoubleClick }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="folder">
      <div className="collapse-container" onClick={() => setIsOpen(!isOpen)}>
        <span>{isOpen ? <ChevronDown className="chevron" strokeWidth={0.8}/> : <ChevronRight className="chevron" strokeWidth={0.8}/>}</span>
        <h4 className="folder-title">{title}</h4>
      </div>

      {/* Mapp-innehåll */}
      {isOpen && (
        <div className="project">
          {projects.map((proj, idx) => (
            <Project 
              key={idx} 
              name={proj} 
              onDoubleClick={onProjectDoubleClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}