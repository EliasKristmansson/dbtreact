import React, { useState } from "react";

export default function Project({ name, onDoubleClick, onDelete, onRename, className }) {
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setSelectedProject(name);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDelete = () => {
    onDelete(selectedProject);
    setContextMenu(null);
  };

  const handleRename = () => {
    const newName = prompt("Ange nytt namn:", selectedProject);
    if (newName && newName !== selectedProject) {
      onRename(selectedProject, newName);
    }
    setContextMenu(null);
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className={className}>
      <li
        onDoubleClick={() => onDoubleClick(name)}
        onContextMenu={handleContextMenu}
      >
        {name}
      </li>

      {contextMenu && (
        <div
          className="context-menu"
          
        >
          <li onClick={handleRename}>Byt namn</li>
          <li onClick={handleDelete}>Ta bort</li>
        </div>
      )}

      {contextMenu && <div className="overlay" onClick={closeContextMenu}></div>}
    </div>
  );
}