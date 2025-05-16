import React from "react";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
export default function Project({name, onDoubleClick,onDelete, className }) {
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault(); // Förhindrar den vanliga högerklicksmenyn
    setSelectedProject(name);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDelete = () => {
    onDelete(selectedProject);// Ta bort projektet
    setContextMenu(null); // Stäng menyn
  };

  const closeContextMenu = () => {
    setContextMenu(null); // Stäng menyn om användaren klickar någon annanstans
  };
  return (

    <div className={className}>
    <li
        onDoubleClick={() => onDoubleClick(name)}
        onContextMenu={handleContextMenu} // Hanterar högerklick
      >
        {name}
      </li>
        {/* Context menu */}
        {contextMenu && (
        <div
          className="context-menu"
          onClick={closeContextMenu}
        >
          <li onClick={handleDelete}>Ta bort {name}</li>
        </div>
      )}

      {contextMenu && <div className="overlay" onClick={closeContextMenu}></div>}
    </div>
  );
}