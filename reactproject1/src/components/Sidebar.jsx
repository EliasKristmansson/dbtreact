import React, { useState } from "react";
import Folder from "./Folder";

export default function Sidebar({ onFilterClick }) {
  const [folders, setFolders] = useState([
    { title: "Prio", projects: ["Projekt 1", "Projekt 2", "Projekt 3"] },
    { title: "Sötvatten", projects: ["Projekt 4", "Projekt 5"] },
    { title: "Marint", projects: ["Projekt 6"] },
  ]);

  const addFolder = () => {
    const newTitle = prompt("Namn på ny mapp:");
    if (newTitle) {
      setFolders([...folders, { title: newTitle, projects: [] }]);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <input type="text" placeholder="Sök..." className="search" />
        <button className="filter-btn" onClick={onFilterClick}>Filter</button>
      </div>
      <div className="divider-line"></div>

      {folders.map((folder, idx) => (
        <React.Fragment key={idx}>
          <Folder title={folder.title} projects={folder.projects} />
          <div className="divider-line"></div>
        </React.Fragment>
      ))}

      <button onClick={addFolder} className="add-folder-btn">+ Ny mapp</button>
    </div>
  );
}
