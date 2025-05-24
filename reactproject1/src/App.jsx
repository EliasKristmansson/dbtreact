import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Workspace from "./components/Workspace";
import Filter from "./components/Filter";
import Statistik from "./components/Statistik";
import buildFolderTree from "./components/BuildFolderTree";

export default function App() {
  const [allProjects, setAllProjects] = useState([
    { id: 1, name: "Projekt 1", folder: "Prio", deadline: null, priority: null },
    { id: 2, name: "Projekt 2", folder: "Prio/Sub1", deadline: null, priority: null },
    { id: 3, name: "Projekt 3", folder: "Prio/Sub1", deadline: null, priority: null },
    { id: 4, name: "Projekt 4", folder: "Sötvatten", deadline: null, priority: null },
    { id: 5, name: "Projekt 5", folder: "Sötvatten/Undermapp", deadline: null, priority: null },
    { id: 6, name: "Projekt 6", folder: "Marint", deadline: null, priority: null },
  ]);

  const folderTree = buildFolderTree(allProjects);

  const [nextId, setNextId] = useState(7);
  const [rowCount, setRowCount] = useState(0);
  const [folders, setFolders] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [projectRows, setProjectRows] = useState({});
  const [activeTabId, setActiveTabId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState("workspace");
  const [commentCount, setCommentCount] = useState(0);
  const [greenFlagsCount, setGreenFlagsCount] = useState(0);
  const [deadlines, setDeadlines] = useState({});

  const handleProjectCreate = (projectName, folder = "Okategoriserad") => {
    const newId = nextId;
    const newProject = { id: newId, name: projectName, folder, deadline: null, priority: null };

    setAllProjects((prev) => {
      const updated = [...prev, newProject];
      console.log("New project created:", newProject);
      console.log("Updated allProjects:", updated);
      return updated;
    });
    setTabs((prev) => [...prev, { id: newId }]);
    setProjectRows((prev) => ({ ...prev, [newId]: [] }));
    setActiveTabId(newId);
    setNextId((prev) => prev + 1);

    setFolders((prev) => (prev.includes(folder) ? prev : [...prev, folder]));
  };

  const handleProjectOpen = (projectName) => {
    const project = allProjects.find((p) => p.name === projectName);
    if (!project) return;

    const existingTab = tabs.find((t) => t.id === project.id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      setTabs((prev) => [...prev, { id: project.id }]);
      setActiveTabId(project.id);
    }

    if (!projectRows[project.id]) {
      setProjectRows((prev) => ({ ...prev, [project.id]: [] }));
    }
  };

  const handleProjectDelete = (projectToDelete) => {
    if (!projectToDelete) return;

    setAllProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
    setDeadlines((prev) => {
      const newDeadlines = { ...prev };
      delete newDeadlines[projectToDelete.id];
      return newDeadlines;
    });
    handleTabClose(projectToDelete.id);
  };

  const handleAddFolder = (newFolderName) => {
    if (!folders.includes(newFolderName)) {
      setFolders((prev) => [...prev, newFolderName]);
    }
  };

  const handleTabClose = (id) => {
    setTabs((prev) => prev.filter((t) => t.id !== id));
    setProjectRows((prev) => {
      const newRows = { ...prev };
      delete newRows[id];
      return newRows;
    });
    if (activeTabId === id) {
      const remaining = tabs.filter((t) => t.id !== id);
      setActiveTabId(remaining[0]?.id || null);
    }
  };

  const handleNewProject = () => {
    handleProjectCreate("Projektnamn");
  };

  const handleRowChange = (tabId, newRows) => {
    setProjectRows((prev) => ({
      ...prev,
      [tabId]: newRows,
    }));
  };

  const handleAddRow = (tabId) => {
    setProjectRows((prev) => ({
      ...prev,
      [tabId]: [
        ...(prev[tabId] || []),
        {
          märkning: "",
          inkommet: "",
          plockat: "",
          andelPlockat: "",
          datum: "",
          antalDjur: "",
          hemtagna: "",
          åter: "",
          kommentarer: "",
        },
      ],
    }));
  };

  const handleRemoveRow = (tabId, indexToRemove) => {
    setProjectRows((prev) => ({
      ...prev,
      [tabId]: prev[tabId].filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleProjectRename = (folder, oldName, newName) => {
    setAllProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.folder === folder && project.name === oldName
          ? { ...project, name: newName }
          : project
      )
    );
  };

  const handleDeadlineChange = (projectId, deadline) => {
    setDeadlines((prev) => ({ ...prev, [projectId]: deadline }));
    setAllProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, deadline } : project
      )
    );
  };

  const handlePriorityChange = (projectId, priority) => {
    setAllProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, priority } : project
      )
    );
  };

  useEffect(() => {
    console.log("folderTree:", folderTree);
  }, [folderTree]);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="app">
      <Topbar
        projectName={activeTab ? allProjects.find((p) => p.id === activeTab.id)?.name || "Ingen tab" : ""}
        deadline={deadlines[activeTabId] || "Ingen deadline"}
        priority={activeTab ? allProjects.find((p) => p.id === activeTab.id)?.priority || null : null}
        tabs={tabs}
        activeTabId={activeTabId}
        rowCount={rowCount}
        greenFlagsCount={greenFlagsCount}
        onTabClick={setActiveTabId}
        onTabClose={handleTabClose}
        allProjects={allProjects}
        commentCount={commentCount}
        onTabRename={(tab, newName) => {
          const project = allProjects.find((p) => p.id === tab.id);
          if (project) {
            handleProjectRename(project.folder, project.name, newName);
          }
        }}
        onPriorityChange={handlePriorityChange}
      />

      <div className="main-content">
        {viewMode === "workspace" ? (
          <>
            <Sidebar
              allProjects={allProjects}
              folders={folderTree}
              activeTabId={activeTabId}
              tabs={tabs}
              handleAddFolder={handleAddFolder}
              onFilterClick={() => setShowFilter(true)}
              onProjectCreate={handleProjectCreate}
              onProjectDelete={handleProjectDelete}
              onProjectOpen={handleProjectOpen}
              onProjectRename={handleProjectRename}
              onShowStatistics={() => setViewMode("statistics")}
              onDeadlineChange={handleDeadlineChange}
              onPriorityChange={handlePriorityChange}
            />
            <Workspace
              activeTabId={activeTabId}
              projectRows={projectRows}
              onChangeRow={handleRowChange}
              onAddRow={handleAddRow}
              onRowCount={setRowCount}
              onGreenFlagsCount={setGreenFlagsCount}
              onRemoveRow={handleRemoveRow}
              onNewProjectClick={handleNewProject}
              tabs={tabs}
              setCommentCount={setCommentCount}
              allProjects={allProjects}
            />
          </>
        ) : (
          <Statistik onBack={() => setViewMode("workspace")} />
        )}
      </div>

      <Filter
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onFilter={() => setShowFilter(false)}
      />
    </div>
  );
}