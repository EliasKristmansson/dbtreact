import React, { useState } from "react";
import Project from "./Project";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function Folder({
  folder,
  projects = [],
  subFolders = [],
  onProjectDoubleClick,
  onProjectDelete,
  onProjectRename,
  activeTabId,
  tabs,
  onProjectOpen,
  handleRename,
  onDeadlineChange,
  onPriorityChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleFolder = () => setIsOpen((prev) => !prev);
  const isActive = (projectId) => {
    const tab = tabs.find((t) => t.id === projectId);
    return tab && tab.id === activeTabId;
  };

  return (
    <div className="folder">
      <div className="collapse-container" onClick={toggleFolder}>
        <span>
          {isOpen ? (
            <ChevronDown className="chevron" strokeWidth={0.8} />
          ) : (
            <ChevronRight className="chevron" strokeWidth={0.8} />
          )}
        </span>
        <h4 className="folder-title">{folder.title}</h4>
      </div>

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
              onDoubleClick={onProjectDoubleClick}
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
                key={subfolder.title}
                folder={subfolder}
                onProjectDoubleClick={onProjectDoubleClick}
                onProjectDelete={onProjectDelete}
                onProjectRename={onProjectRename}
                onProjectOpen={onProjectOpen}
                handleRename={handleRename}
                activeTabId={activeTabId}
                tabs={tabs}
                onDeadlineChange={onDeadlineChange}
                onPriorityChange={onPriorityChange}
              />
            ))}
        </div>
      )}
    </div>
  );
}