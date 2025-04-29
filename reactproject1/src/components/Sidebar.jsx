import React, { useState } from "react";
import Folder from "./Folder";
import { FaFileAlt, FaFolderPlus, FaSyncAlt, FaCompressAlt } from "react-icons/fa";

export default function Sidebar({ onFilterClick, onProjectCreate, onProjectOpen }) {
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

  const addProject = () => {
    const folderIndex = prompt("Ange mappindex (0 för första mappen):");
    if (folderIndex === null) return;
    
    const idx = parseInt(folderIndex);
    if (isNaN(idx) || idx < 0 || idx >= folders.length) {
      alert("Ogiltigt mappindex");
      return;
    }

    const projectName = prompt("Namn på nytt projekt:");
    if (projectName) {
      const updatedFolders = [...folders];
      updatedFolders[idx].projects.push(projectName);
      setFolders(updatedFolders);
      
      // Call the onProjectCreate callback with the new project name
      onProjectCreate(projectName);
    }
  };

  const handleProjectDoubleClick = (projectName) => {
    onProjectOpen(projectName);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <p>Projektfönster</p>
        <div className="sidebar-icons">
          <FaFileAlt title="Lägg till projekt" onClick={addProject} />
          <FaFolderPlus title="Lägg till mapp" onClick={addFolder} />
          <FaSyncAlt title="Uppdatera" onClick={() => console.log("Refresh")} />
          <FaCompressAlt title="Stäng öppna mappar" onClick={() => console.log("Minimera")} />
        </div>
      </div>
    
      <div className="sidebar-header">
        <input type="text" placeholder="Sök..." className="search" />
        <button className="filter-btn" onClick={onFilterClick}>Filter</button>
      </div>
     
      <div className="divider-line"></div>

      {folders.map((folder, idx) => (
        <React.Fragment key={idx}>
          <Folder 
            title={folder.title} 
            projects={folder.projects} 
            onProjectDoubleClick={handleProjectDoubleClick}
          />
        </React.Fragment>
      ))}
    </div>
  );
}