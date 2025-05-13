import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { FaTimes } from "react-icons/fa";

export default function Folder({ title, projects, onProjectDoubleClick, onProjectDelete }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="folder">
      <div className="collapse-container" onClick={() => setIsOpen(!isOpen)}>
        <span>{isOpen ? <ChevronDown className="chevron" strokeWidth={0.8} /> : <ChevronRight className="chevron" strokeWidth={0.8} />}</span>
        <h4 className="folder-title">{title}</h4>
      </div>

      {isOpen && (
        <div className="project">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="project-item"
              onDoubleClick={() => onProjectDoubleClick(proj)}
            >
              <span className="project-name">{proj}</span>
              <FaTimes
                className="delete-icon"
                title="Ta bort projekt"
                onClick={(e) => {
                  e.stopPropagation(); // förhindrar dubbelklick
                  onProjectDelete(idx);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
