import React, { useState } from "react";
import Project from "./Project";
import {FaChevronDown,FaChevronRight} from "react-icons/fa";

export default function Folder({ title, projects }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="collapse-button">
      <div className="collapse-container" onClick={() => setIsOpen(!isOpen)}>
        <span className="chevron">{isOpen ? <FaChevronDown/>: <FaChevronRight/>}</span>
        <h4 className="folder-title">{title}</h4>
      </div>

      {/* Mapp-innehåll */}
      {isOpen && (
        <div className="project">
          {projects.map((proj, idx) => (
            <Project key={idx} name={proj} />
          ))}
        </div>
      )}
    </div>
  );
}
