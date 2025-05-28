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
  onMoveItem,
  allProjects,
}) {
  const isActive = (projectId) => {
    const tab = tabs.find((t) => t.id === projectId);
    return tab && tab.id === activeTabId;
  };

  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);

  const handleDragStart = (e) => {
    if (!folder.id) {
      console.error(`Folder ID is undefined for path: ${folder.path}`);
      return;
    }
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        id: folder.id,
        type: "folder",
      })
    );
    e.currentTarget.classList.add("dragging");
    console.log(`Folder drag start: ${folder.path}, ID: ${folder.id}`);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drop-target");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drop-target");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    e.currentTarget.classList.remove("drop-target");

    if (data.id === folder.id) {
      console.log("Cannot drop folder on itself");
      return;
    }

    console.log(`Folder drop: ${data.type} ID ${data.id} onto ${folder.path}`);
    onMoveItem(data.id, data.type, folder.path);
  };

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
    <div
      className="folder"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-path={folder.path} // Lägg till data-path
    >
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
              key={proj.id} // Använd proj.id som key
              name={proj.name}
              projectId={proj.id}
              deadline={proj.deadline}
              priority={proj.priority}
              className={`project-item ${isActive(proj.id) ? "active" : ""}`}
              onDoubleClick={onProjectOpen}
              onDelete={() => onProjectDelete(proj)}
              onRename={(oldName, newName) =>
                onProjectRename(folder.path, oldName, newName)
              }
              onDeadlineChange={onDeadlineChange}
              onPriorityChange={onPriorityChange}
              activeTabId={activeTabId}
              onMoveItem={onMoveItem}
            />
          ))}
          {folder.subFolders &&
            folder.subFolders.map((subfolder, index) => (
              <Folder
                key={subfolder.id || subfolder.path} // Använd id om tillgängligt
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
                onMoveItem={onMoveItem}
                allProjects={allProjects}
              />
            ))}
        </div>
      )}
    </div>
  );
}