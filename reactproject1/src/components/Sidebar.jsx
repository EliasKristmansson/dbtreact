import React, { useState, useRef, useEffect } from "react";
import Folder from "./Folder";
import "./sidebar.css";
import { FaFileAlt, FaFolderPlus, FaSyncAlt, FaCompressAlt, FaRegEye } from "react-icons/fa";

export default function Sidebar({
  allProjects,
  onFilterClick,
  onProjectCreate,
  onProjectOpen,
  onProjectDelete,
  onProjectRename,
  onShowStatistics,
  folders,
  activeTabId,
  tabs,
  handleAddFolder,
  onDeadlineChange,
  onPriorityChange,
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const sidebarRef = useRef(null);
  const isResizing = useRef(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isOpen, setIsOpen] = useState(() => {
    const initialState = {};
    const collectFolderPaths = (folderList) => {
      folderList.forEach((folder) => {
        initialState[folder.path] = false; // Alla mappar stängda initialt
        if (folder.subFolders) {
          collectFolderPaths(folder.subFolders);
        }
      });
    };
    collectFolderPaths(folders);
    return initialState;
  });

  // Synkronisera isOpen med folders när folders ändras, utan att överskriva existerande tillstånd
  useEffect(() => {
    setIsOpen((prev) => {
      const newState = { ...prev };
      const collectFolderPaths = (folderList) => {
        folderList.forEach((folder) => {
          if (!(folder.path in newState)) {
            newState[folder.path] = false; // Nya mappar stängda initialt
          }
          if (folder.subFolders) {
            collectFolderPaths(folder.subFolders);
          }
        });
      };
      collectFolderPaths(folders);
      return newState;
    });
  }, [folders]);

  const handleRename = (folder, oldName, newName) => {
    onProjectRename(folder.path, oldName, newName);
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
    const newTitle = prompt("Namn på ny mapp (använd / för att skapa submappar, t.ex. Mapp1/Submapp):");
    if (!newTitle || !newTitle.trim()) {
      alert("Mappnamnet får inte vara tomt!");
      return;
    }
    if (newTitle.includes("//")) {
      alert("Ogiltig mappstruktur! Använd enkel / för att separera mappar.");
      return;
    }
    handleAddFolder(newTitle.trim());
  };

  const addProject = () => {
    const folderPath = prompt("Ange mapp eller mappstruktur (t.ex. Mapp1/Submapp):");
    if (!folderPath || !folderPath.trim()) {
      alert("Mappnamnet får inte vara tomt!");
      return;
    }
    if (folderPath.includes("//")) {
      alert("Ogiltig mappstruktur! Använd enkel / för att separera mappar.");
      return;
    }
    const projectName = prompt("Namn på nytt projekt:");
    if (!projectName || !projectName.trim()) {
      alert("Projektnamnet får inte vara tomt!");
      return;
    }
    onProjectCreate(projectName.trim(), folderPath.trim());
  };

  const toggleFolder = (folderPath) => {
    setIsOpen((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const closeAllFolders = () => {
    setIsOpen((prev) => {
      const allClosed = { ...prev };
      const collectFolderPaths = (folderList) => {
        folderList.forEach((folder) => {
          allClosed[folder.path] = false;
          if (folder.subFolders) {
            collectFolderPaths(folder.subFolders);
          }
        });
      };
      collectFolderPaths(folders);
      return allClosed;
    });
  };

  const refreshPage = () => {
    window.location.reload();
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
            <FaSyncAlt title="Uppdatera" onClick={refreshPage} />
            <FaCompressAlt title="Stäng öppna mappar" onClick={closeAllFolders} />
            <FaRegEye
              title={isMinimized ? "Återställ projektfönster" : "Minimera projektfönster"}
              onClick={() => {
                if (isMinimized) {
                  setSidebarWidth(250);
                } else {
                  setSidebarWidth(0);
                }
                setIsMinimized(!isMinimized);
              }}
            />
          </div>
        </div>

        <div className={`sidebar-search ${isMinimized ? "minimized" : ""}`}>
          <input
            type="text"
            placeholder="Sök..."
            className={`search ${isMinimized ? "minimized" : ""}`}
          />
          <button
            className={`filter-btn ${isMinimized ? "minimized" : ""}`}
            onClick={onFilterClick}
          >
            Filter
          </button>
        </div>
        <div className="divider-line"></div>
      </div>

      <div className="folder-container">
        <div className={`folders-container ${isMinimized ? "minimized" : ""}`}>
          {folders.map((folder, i) => (
            <Folder
              key={i}
              folder={folder}
              activeTabId={activeTabId}
              tabs={tabs}
              isOpen={isOpen[folder.path]}
              toggleFolder={toggleFolder}
              openFolders={isOpen}
              projects={allProjects.filter((p) => p.folder === folder.path)}
              onProjectOpen={onProjectOpen}
              onProjectDelete={onProjectDelete}
              onProjectRename={handleRename}
              onDeadlineChange={onDeadlineChange}
              onPriorityChange={onPriorityChange}
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

      <div className={`sidebar-footer ${isMinimized ? "minimized" : ""}`}>
        <button
          className={`stats-button ${isMinimized ? "minimized" : ""}`}
          onClick={onShowStatistics}
        >
          📊 Visa statistik
        </button>
      </div>
    </div>
  );
}