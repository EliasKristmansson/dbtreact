import React from "react";
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
}) {
  const isActive = (projectId) => {
    const tab = tabs.find((t) => t.id === projectId);
    return tab && tab.id === activeTabId;
  };

  return (
    <div className="folder">
      <div className="collapse-container" onClick={() => toggleFolder(folder.path)}>
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
              />
            ))}
        </div>
      )}
    </div>
  );
}