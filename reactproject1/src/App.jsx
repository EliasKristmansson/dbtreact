import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Workspace from "./components/Workspace";
import Filter from "./components/Filter";
import Statistik from "./components/Statistik";
import buildFolderTree from "./components/BuildFolderTree";

export default function App() {
  const [allProjects, setAllProjects] = useState([
    { id: 1, name: "Projekt C", folder: "Sötvatten/Kundnamn Z", deadline: null, priority: null },
    { id: 2, name: "Projekt A", folder: "Bräckt vatten/Kundnamn X", deadline: null, priority: null },
    { id: 3, name: "Projekt B", folder: "Bräckt vatten/Kundnamn Y", deadline: null, priority: null },
    { id: 4, name: "Projekt!", folder: "Sötvatten/Kundnamn Z/Sub 3", deadline: null, priority: null },
  ]);

  const [folders, setFolders] = useState([
    { id: 100, name: "Prio" },
    { id: 101, name: "Sötvatten" },
    { id: 102, name: "Sötvatten/Kundnamn Z" },
    { id: 103, name: "Sötvatten/Kundnamn Z/Sub 3" },
    { id: 104, name: "Marint" },
    { id: 105, name: "Marint/Kundnamn Ma" },
    { id: 106, name: "Bräckt vatten" },
    { id: 107, name: "Bräckt vatten/Kundnamn X" },
    { id: 108, name: "Bräckt vatten/Kundnamn Y" },
  ]);

  const [nextId, setNextId] = useState(7);
  const [nextFolderId, setNextFolderId] = useState(105);
  const [rowCount, setRowCount] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [projectRows, setProjectRows] = useState({});
  const [activeTabId, setActiveTabId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState("workspace");
  const [commentCount, setCommentCount] = useState(0);
  const [greenFlagsCount, setGreenFlagsCount] = useState(0);
  const [deadlines, setDeadlines] = useState({});

  const handleProjectCreate = (projectName, folder = "Allmänt") => {
    const newId = nextId;
    const newProject = { id: newId, name: projectName, folder, deadline: null, priority: null };

    setAllProjects((prev) => {
      const updated = [...prev, newProject];
      console.log("New project created:", newProject);
      console.log("Updated allProjects:", updated);
      return updated;
    });

    // Ensure the folder exists in folders state
    if (!folders.some((f) => f.name === folder)) {
      setFolders((prev) => [
        ...prev,
        { id: nextFolderId, name: folder },
      ]);
      setNextFolderId((prev) => prev + 1);
    }

    setTabs((prev) => [...prev, { id: newId, name: projectName }]);
    setProjectRows((prev) => ({ ...prev, [newId]: [] }));
    setActiveTabId(newId);
    setNextId((prev) => prev + 1);
  };

  const handleAddFolder = (folderPath) => {
    if (!folderPath || !folderPath.trim()) {
      console.warn("Folder path cannot be empty");
      return;
    }

    // Check if folder already exists
    if (folders.some((f) => f.name === folderPath)) {
      console.log("Folder already exists:", folderPath);
      return;
    }

    const newFolder = {
      id: nextFolderId,
      name: folderPath.trim(),
    };

    setFolders((prev) => {
      const updated = [...prev, newFolder];
      console.log("New folder created:", newFolder);
      console.log("Updated folders:", updated);
      return updated;
    });
    setNextFolderId((prev) => prev + 1);
  };

  const handleDeleteFolder = (folderPath) => {
    console.log(`App.jsx: Deleting folder with path: ${folderPath}`);
    // Remove folder and its subfolders
    setFolders((prev) => {
      const updated = prev.filter((folder) => {
        // Remove folder if its path matches or is a subfolder (starts with folderPath + "/")
        return folder.name !== folderPath && !folder.name.startsWith(`${folderPath}/`);
      });
      console.log("Updated folders:", updated);
      return updated;
    });

    // Remove projects in the folder or its subfolders
    setAllProjects((prev) => {
      const updated = prev.filter((project) => {
        return project.folder !== folderPath && !project.folder.startsWith(`${folderPath}/`);
      });
      console.log("Updated allProjects:", updated);
      return updated;
    });

    // Close any tabs associated with deleted projects
    setTabs((prev) => {
      const updated = prev.filter((tab) => {
        const project = allProjects.find((p) => p.id === tab.id);
        return project && (project.folder !== folderPath && !project.folder.startsWith(`${folderPath}/`));
      });
      console.log("Updated tabs:", updated);
      return updated;
    });

    // Update activeTabId if the active tab was removed
    if (tabs.some((tab) => tab.id === activeTabId)) {
      const remaining = tabs.filter((tab) => {
        const project = allProjects.find((p) => p.id === tab.id);
        return project && (project.folder !== folderPath && !project.folder.startsWith(`${folderPath}/`));
      });
      setActiveTabId(remaining[0]?.id || null);
    }
  };

  const handleProjectOpen = (projectName) => {
    const project = allProjects.find((p) => p.name === projectName);
    if (!project) return;

    const existingTab = tabs.find((t) => t.id === project.id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      setTabs((prev) => [...prev, { id: project.id, name: project.name }]);
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

  const handleTabClose = (id) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
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
    handleProjectCreate(projectName.trim(), folderPath.trim());
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
    setTabs((prev) =>
      prev.map((tab) =>
        tab.name === oldName && allProjects.find((p) => p.id === tab.id && p.folder === folder)
          ? { ...tab, name: newName }
          : tab
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

  const folderTree = buildFolderTree(allProjects, folders);

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
              onFolderDelete={handleDeleteFolder}
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