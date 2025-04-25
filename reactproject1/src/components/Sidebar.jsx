import React, { useState } from "react";
import Folder from "./Folder";
import { FaFileAlt, FaFolderPlus, FaSyncAlt, FaCompressAlt } from "react-icons/fa";

export default function Sidebar() {
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

      <div className="sidebar-container">
        <p>Projektfönster</p>
        <div className="sidebar-icons">
          <FaFileAlt title="Lägg till fil" onClick={() => addFolder()} />
          <FaFolderPlus title="Lägg till mapp" onClick={() => addFolder()} />
          <FaSyncAlt title="Uppdatera" onClick={() => console.log("Refresh")} />
          <FaCompressAlt title="Stäng öppna mappar" onClick={() => console.log("Minimera")} />
        </div>
		  </div>
    
      <div className="sidebar-header">
        <input type="text" placeholder="Sök..." className="search" />
        <button className="filter-btn">Filter</button>
      </div>
     
     {/*  <button onClick={addFolder} className="add-folder-btn">+ Ny mapp</button>
      */}
      <div className="divider-line"></div>

      {folders.map((folder, idx) => (
        <React.Fragment key={idx}>
          <Folder title={folder.title} projects={folder.projects} />
          <div className="divider-line"></div>
        </React.Fragment>
      ))}
    </div>
  );
}
