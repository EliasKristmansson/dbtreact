import React, { useState, useEffect, useRef } from "react";
import Project from "./Project";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function Folder({
  folder,
  projects = [],
  activeTabId,
  tabs,
  isOpen,
  toggleFolder,
  openFolders,
  onProjectOpen,
  onProjectDelete,
  onProjectRename,
  onDeadlineChange,
  onPriorityChange,
  onFolderDelete,
  onFolderRename,
}) {
  const isActive = (projectId) => {
    const tab = tabs.find((t) => t.id === projectId);
    return tab && tab.id === activeTabId;
  };

  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    console.log(`Opening context menu for folder: ${folder.path}`);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteFolder = () => {
    console.log(`Attempting to delete folder: ${folder.path}`);
    if (window.confirm(`Är du säker på att du vill ta bort mappen "${folder.title}" och allt dess innehåll?`)) {
      console.log(`Confirmed deletion of folder: ${folder.path}`);
      if (onFolderDelete) {
        onFolderDelete(folder.path);
      } else {
        console.warn("onFolderDelete is not defined");
      }
    }
    setContextMenu(null);
  };

  const handleRenameFolder = () => {
    const newName = prompt(`Ange nytt namn för "${folder.title}":`, folder.title);
    console.log(`Rename prompt returned: ${newName}`);
    if (newName && newName.trim()) {
      console.log(`Attempting to rename folder: ${folder.path} to ${newName}`);
      if (onFolderRename) {
        onFolderRename(folder.path, newName.trim());
      } else {
        console.warn("onFolderRename is not defined");
      }
    } else {
      console.log("Rename cancelled or invalid name");
    }
    setContextMenu(null);
  };

  // Close context menu on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        console.log("Clicked outside context menu, closing");
        setContextMenu(null);
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        console.log("Escape key pressed, closing context menu");
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [contextMenu]);

  return (
    <div className="folder">
      <div
        className="collapse-container"
        onClick={() => toggleFolder(folder.path)}
        onContextMenu={handleContextMenu}
      >
        <span>
          {isOpen ? (
            <ChevronDown className="chevron" strokeWidth={0.8} />
          ) : (
            <ChevronRight className="chevron" strokeWidth={0.8} />
          )}
        </span>
        <h4 className="folder-title">{folder.title}</h4>
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          ref={contextMenuRef}
        >
          <div className="context-menu-item" onClick={handleRenameFolder}>
            Byt namn
          </div>
          <div className="context-menu-item" onClick={handleDeleteFolder}>
            Ta bort
          </div>
        </div>
      )}

      {isOpen && (
        <div className="project">
          {folder.projects.map((proj, idx) => (
            <Project
              key={idx}
              name={proj.name}
              projectId={proj.id}
              deadline={proj.deadline}
              priority={proj.priority}
              className={`project-item ${isActive(proj.id) ? "active" : ""}`}
              onDoubleClick={onProjectOpen}
              onDelete={() => onProjectDelete(proj)}
              onRename={(oldName, newName) =>
                onProjectRename(folder, oldName, newName)
              }
              onDeadlineChange={onDeadlineChange}
              onPriorityChange={onPriorityChange}
              activeTabId={activeTabId}
            />
          ))}
          {folder.subFolders &&
            folder.subFolders.map((subfolder) => (
              <Folder
                key={subfolder.path}
                folder={subfolder}
                activeTabId={activeTabId}
                tabs={tabs}
                isOpen={openFolders[subfolder.path]}
                toggleFolder={toggleFolder}
                openFolders={openFolders}
                projects={projects.filter((p) => p.folder === subfolder.path)}
                onProjectOpen={onProjectOpen}
                onProjectDelete={onProjectDelete}
                onProjectRename={onProjectRename}
                onDeadlineChange={onDeadlineChange}
                onPriorityChange={onPriorityChange}
                onFolderDelete={onFolderDelete}
                onFolderRename={onFolderRename}
              />
            ))}
        </div>
      )}
    </div>
  );
}