import React, { useState, useRef } from "react";
import Folder from "./Folder";
import { FaFileAlt, FaFolderPlus, FaSyncAlt, FaCompressAlt, FaRegEye } from "react-icons/fa";

export default function Sidebar({ onFilterClick, onProjectCreate, onProjectOpen }) {
    const [folders, setFolders] = useState([
        { title: "Prio", projects: ["Projekt 1", "Projekt 2", "Projekt 3"] },
        { title: "Sötvatten", projects: ["Projekt 4", "Projekt 5"] },
        { title: "Marint", projects: ["Projekt 6"] },
    ]);

    const [isMinimized, setIsMinimized] = useState(false);
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);
    const [sidebarWidth, setSidebarWidth] = useState(250);

    const startResizing = (e) => {
        isResizing.current = true;
        document.addEventListener("mousemove", resizeSidebar);
        document.addEventListener("mouseup", stopResizing);
    };

    const resizeSidebar = (e) => {
        if (!isResizing.current) return;
        const newWidth = e.clientX;
        if (newWidth >= 180 && newWidth <= 500) {
            setSidebarWidth(newWidth);
            if (isMinimized && newWidth > 50) {
                setIsMinimized(false);
            }
        }
    };

    const stopResizing = () => {
        isResizing.current = false;
        document.removeEventListener("mousemove", resizeSidebar);
        document.removeEventListener("mouseup", stopResizing);
    };

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
            // Update the local folder state
            const updatedFolders = [...folders];
            updatedFolders[idx].projects.push(projectName);
            setFolders(updatedFolders);
            
            // Create the project in App.jsx and open it
            onProjectCreate(projectName);
            
            // Optionally also open the newly created project
            // Uncomment if you want projects to be automatically opened when created
            // onProjectOpen(projectName);
        }
    };

    // We're now passing onProjectOpen directly to the Folder component
    // This function is kept for backward compatibility
    const handleProjectDoubleClick = (projectName) => {
        onProjectOpen(projectName);
    };

    const minimizeSideBar = () => {
        if (isMinimized) {
            setSidebarWidth(250);
        } else {
            setSidebarWidth(0);
        }
        setIsMinimized(!isMinimized);
    };

    return (
        <div
            className="sidebar"
            ref={sidebarRef}
            style={{ width: `${sidebarWidth}px` }}
            onClick={() => {
                if (isMinimized) {
                    setSidebarWidth(250);
                    setIsMinimized(false);
                }
            }}
        >

          <div className="sidebar-header">
            <div className="sidebar-title">
                {/* Title and icons that should be minimized */}
              <p className={`sidebar-title ${isMinimized ? "minimized" : ""}`}>Projektfönster</p> 
              <div className={`sidebar-icons ${isMinimized ? "minimized" : ""}`}>
                <FaFileAlt title="Lägg till projekt" onClick={addProject} />
                <FaFolderPlus title="Lägg till mapp" onClick={addFolder} />
                <FaSyncAlt title="Uppdatera" onClick={() => console.log("Refresh")} />
                <FaCompressAlt title="Stäng öppna mappar" onClick={() => console.log("Minimera")} />
                    <FaRegEye title={isMinimized ? "Återställ projektfönster" : "Minimera projektfönster"} onClick={minimizeSideBar} />
              </div>
            </div>
            {/* Search and filter buttons */}
            <div className={`sidebar-search ${isMinimized ? "minimized" : ""}`}>
              <input type="text" placeholder="Sök..." className={`search ${isMinimized ? "minimized" : ""}`} />
              <button className={`filter-btn ${isMinimized ? "minimized" : ""}`} onClick={onFilterClick}>Filter</button>
            </div>
            <div className="divider-line"></div>
          </div>

           
          <div className="folder-container">
            {/* Folder list - updated to pass onProjectOpen to each Folder */}
            <div className={`folders-container ${isMinimized ? "minimized" : ""}`}>
                {folders.map((folder, idx) => (
                    <React.Fragment key={idx}>
                        <Folder
                            title={folder.title}
                            projects={folder.projects}
                            onProjectDoubleClick={onProjectOpen}
                        />
                    </React.Fragment>
                ))}
            </div>
          </div>

            <div
                className="resizer"
                onMouseDown={startResizing}
                onClick={() => {
                    if (isMinimized) {
                        setSidebarWidth(250);
                        setIsMinimized(false);
                    }
                }}
            ></div>
        </div>
    );
}