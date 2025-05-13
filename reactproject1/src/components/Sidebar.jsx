import React, { useState, useRef } from "react";
import Folder from "./Folder";
import "./sidebar.css";
import { FaFileAlt, FaFolderPlus, FaSyncAlt, FaCompressAlt, FaRegEye } from "react-icons/fa";

export default function Sidebar({allProjects, onFilterClick, onProjectCreate, onProjectOpen, onProjectDelete, onShowStatistics}) {
    const grouped = allProjects.reduce((acc, project) => {
        if (!acc[project.folder]) acc[project.folder] = [];
        acc[project.folder].push(project);
        return acc;
    }, {});

    const [isMinimized, setIsMinimized] = useState(false);
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);
    const [sidebarWidth, setSidebarWidth] = useState(250);
    
    const handleDelete = (folderTitle, projectIndex) => {
        if (window.confirm("Vill du ta bort detta projekt?")) {
            onProjectDelete(folderTitle, projectIndex);
        }
    };

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
        const folderName = prompt("Ange namn på mapp:");
        if (!folderName) return;
    
        const projectName = prompt("Namn på nytt projekt:");
        if (projectName) {
            onProjectCreate(projectName, folderName); // <-- Viktigt!
        }
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
                    <p className={`sidebar-title ${isMinimized ? "minimized" : ""}`}>Projektfönster</p> 
                    <div className={`sidebar-icons ${isMinimized ? "minimized" : ""}`}>
                        <FaFileAlt title="Lägg till projekt" onClick={addProject} />
                        <FaFolderPlus title="Lägg till mapp" onClick={addFolder} />
                        <FaSyncAlt title="Uppdatera" />
                        <FaCompressAlt title="Stäng öppna mappar" />
                        <FaRegEye title={isMinimized ? "Återställ projektfönster" : "Minimera projektfönster"} onClick={() => {
                            if (isMinimized) {
                                setSidebarWidth(250);
                            } else {
                                setSidebarWidth(0);
                            }
                            setIsMinimized(!isMinimized);
                        }} />
                    </div>
                </div>

                <div className={`sidebar-search ${isMinimized ? "minimized" : ""}`}>
                    <input type="text" placeholder="Sök..." className={`search ${isMinimized ? "minimized" : ""}`} />
                    <button className={`filter-btn ${isMinimized ? "minimized" : ""}`} onClick={onFilterClick}>Filter</button>
                </div>
                <div className="divider-line"></div>
            </div>

            <div className="folder-container">
                <div className={`folders-container ${isMinimized ? "minimized" : ""}`}>
                {Object.entries(grouped).map(([folderTitle, projects], idx) => (
                <Folder
                    key={idx}
                    title={folderTitle}
                    projects={projects.map((p) => p.name)}
                    onProjectDoubleClick={onProjectOpen}
                    onProjectDelete={(projectIndex) => handleDelete(folderTitle, projectIndex)}
                />
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

            <div className="sidebar-footer">
            <button className="stats-button" onClick={onShowStatistics}>
                📊 Visa statistik
            </button>
            </div>


        </div>
    );
}
