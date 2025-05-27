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
  onFolderDelete,
  onFolderRename,
  onMoveItem, // Ny prop
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const sidebarRef = useRef(null);
  const isResizing = useRef(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(() => {
    const initialState = {};
    const collectFolderPaths = (folderList) => {
      folderList.forEach((folder) => {
        initialState[folder.path] = false;
        if (folder.subFolders) {
          collectFolderPaths(folder.subFolders);
        }
      });
    };
    collectFolderPaths(folders);
    return initialState;
  });

  // Synkronisera isOpen med folders när folders ändras
  useEffect(() => {
    setIsOpen((prev) => {
      const newState = {};
      const collectFolderPaths = (folderList) => {
        folderList.forEach((folder) => {
          newState[folder.path] = prev[folder.path] ?? false;
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
    console.log(`Sidebar: Handling project rename in folder ${folder.path} from ${oldName} to ${newName}`);
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
      const allClosed = {};
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

  // Hantera sökning
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    console.log("Sidebar: Search query updated:", query);
  };

  // Filtrera mappar och projekt baserat på söksträngen
  const getFilteredFolders = () => {
    if (!searchQuery.trim()) {
      console.log("Sidebar: No search query, returning all folders");
      return { folders, openPaths: new Set() };
    }

    const queryLower = searchQuery.toLowerCase();
    const filteredFolders = [];
    const includedFolderPaths = new Set();
    const openPaths = new Set();

    // Hitta matchande projekt och deras mappar
    allProjects.forEach((project) => {
      if (project.name.toLowerCase().includes(queryLower)) {
        const folderPath = project.folder;
        console.log(`Sidebar: Project match: ${project.name} in ${folderPath}`);
        includedFolderPaths.add(folderPath);
        // Lägg till alla föräldramappar och markera dem som öppna
        let path = folderPath;
        while (path) {
          includedFolderPaths.add(path);
          openPaths.add(path);
          path = path.includes("/") ? path.substring(0, path.lastIndexOf("/")) : "";
        }
      }
    });

    // Lägg till mappar som matchar söksträngen
    const collectMatchingFolders = (folderList, parentFilteredFolders) => {
      folderList.forEach((folder) => {
        const folderMatches = folder.path.toLowerCase().includes(queryLower);
        const pathMatches = includedFolderPaths.has(folder.path);

        if (folderMatches || pathMatches) {
          console.log(`Sidebar: Folder match: ${folder.path}`);
          const filteredFolder = { ...folder };
          includedFolderPaths.add(folder.path);
          if (folderMatches) {
            openPaths.add(folder.path);
          }
          if (folder.subFolders) {
            filteredFolder.subFolders = [];
            collectMatchingFolders(folder.subFolders, filteredFolder.subFolders);
          }
          parentFilteredFolders.push(filteredFolder);
        } else if (folder.subFolders) {
          // Kontrollera submappar rekursivt
          const subFolders = [];
          collectMatchingFolders(folder.subFolders, subFolders);
          if (subFolders.length > 0) {
            const filteredFolder = { ...folder, subFolders };
            parentFilteredFolders.push(filteredFolder);
          }
        }
      });
    };

    collectMatchingFolders(folders, filteredFolders);
    console.log("Sidebar: Filtered folders:", filteredFolders);
    console.log("Sidebar: Included folder paths:", Array.from(includedFolderPaths));
    console.log("Sidebar: Folders to open:", Array.from(openPaths));
    return { folders: filteredFolders, openPaths };
  };

  const { folders: filteredFolders, openPaths } = getFilteredFolders();

  // Öppna mappar baserat på sökresultat
  useEffect(() => {
    if (openPaths.size > 0) {
      setIsOpen((prev) => {
        const newOpen = { ...prev };
        openPaths.forEach((path) => {
          newOpen[path] = true;
        });
        console.log("Sidebar: Updated isOpen:", newOpen);
        return newOpen;
      });
    }
  }, [searchQuery, folders, allProjects]);

  // Filtrera projekt för varje mapp
  const getFilteredProjects = (folderPath) => {
    if (!searchQuery.trim()) {
      const projects = allProjects.filter((p) => p.folder === folderPath);
      console.log(`Sidebar: All projects for ${folderPath}:`, projects);
      return projects;
    }

    const queryLower = searchQuery.toLowerCase();
    const filteredProjects = allProjects.filter(
      (project) =>
        project.folder === folderPath &&
        project.name.toLowerCase().includes(queryLower)
    );
    console.log(`Sidebar: Filtered projects for ${folderPath}:`, filteredProjects);
    return filteredProjects;
  };

  useEffect(() => {
    console.log("Sidebar: onFolderRename prop received:", onFolderRename);
  }, [onFolderRename]);

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
            value={searchQuery}
            onChange={handleSearchChange}
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
          {filteredFolders.length > 0 ? (
            filteredFolders.map((folder, i) => (
              <Folder
                key={i}
                folder={folder}
                activeTabId={activeTabId}
                tabs={tabs}
                isOpen={isOpen[folder.path]}
                toggleFolder={toggleFolder}
                openFolders={isOpen}
                projects={getFilteredProjects(folder.path)}
                onProjectOpen={onProjectOpen}
                onProjectDelete={onProjectDelete}
                onProjectRename={handleRename}
                onDeadlineChange={onDeadlineChange}
                onPriorityChange={onPriorityChange}
                onFolderDelete={onFolderDelete}
                onFolderRename={onFolderRename}
                onMoveItem={onMoveItem} // Passera onMoveItem
                allProjects={allProjects} // Passera allProjects för att hitta folder ID
              />
            ))
          ) : (
            <p className="no-results">Inga resultat hittades</p>
          )}
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