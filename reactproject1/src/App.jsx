import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Workspace from "./components/Workspace";
import Filter from "./components/Filter";
import Statistik from "./components/Statistik";
import buildFolderTree from "./components/BuildFolderTree";
import PageLoader from "./components/PageLoader";




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
  const [nextFolderId, setNextFolderId] = useState(109);
  const [rowCount, setRowCount] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [projectRows, setProjectRows] = useState({});
  const [activeTabId, setActiveTabId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState("workspace");
  const [commentCount, setCommentCount] = useState(0);
  const [greenFlagsCount, setGreenFlagsCount] = useState(0);
  const [deadlines, setDeadlines] = useState({});

  const [isLoading, setIsLoading] = useState(true);
	

	useEffect(() => {
		const timeout = setTimeout(() => setIsLoading(false), 5000);
		return () => clearTimeout(timeout);
	}, []);

  const handleMoveItem = (itemId, itemType, newParentPath, position = null) => {
    console.log(`App: Moving ${itemType} with ID ${itemId} to ${newParentPath || "top level"}, position: ${position}`);
    
    if (itemType === "folder") {
      // Hitta mappen
      const folder = folders.find((f) => f.id === itemId);
      if (!folder) {
        console.error(`App: Folder with ID ${itemId} not found`);
        return;
      }

      // Beräkna ny sökväg
      const folderName = folder.name.split("/").pop();
      const newPath = newParentPath ? `${newParentPath}/${folderName}` : folderName;

      // Kontrollera att mappen inte flyttas till en egen undermapp
      if (newPath.startsWith(`${folder.name}/`)) {
        alert("Kan inte flytta en mapp till dess egen undermapp!");
        return;
      }

      // Kontrollera att målmappen inte redan finns
      if (folders.some((f) => f.name === newPath && f.id !== itemId)) {
        alert(`En mapp med namnet "${folderName}" finns redan på denna plats!`);
        return;
      }

      // Uppdatera folders
      setFolders((prev) => {
        // Ta bort mappen från dess nuvarande plats
        let updatedFolders = prev.filter((f) => f.id !== itemId);
        // Uppdatera sökvägar för submappar
        updatedFolders = updatedFolders.map((f) => {
          if (f.name.startsWith(`${folder.name}/`)) {
            const newSubPath = newPath + f.name.slice(folder.name.length);
            return { ...f, name: newSubPath };
          }
          return f;
        });
        // Lägg till mappen på ny plats
        const newFolder = { ...folder, name: newPath };
        if (position !== null) {
          // Hitta rätt position på toppnivån eller i målmappen
          const parentFolders = newParentPath
            ? updatedFolders.filter((f) => f.name.startsWith(newParentPath + "/") && f.name.split("/").length === newParentPath.split("/").length + 1)
            : updatedFolders.filter((f) => !f.name.includes("/"));
          updatedFolders = updatedFolders.filter((f) => !parentFolders.includes(f));
          parentFolders.splice(position, 0, newFolder);
          updatedFolders = [...updatedFolders, ...parentFolders];
        } else {
          updatedFolders.push(newFolder);
        }
        console.log("App: Updated folders:", updatedFolders);
        return updatedFolders;
      });

      // Uppdatera projekt som ligger i mappen eller dess submappar
      setAllProjects((prev) => {
        const updated = prev.map((p) => {
          if (p.folder === folder.name || p.folder.startsWith(`${folder.name}/`)) {
            const newProjectPath = newPath + p.folder.slice(folder.name.length);
            return { ...p, folder: newProjectPath };
          }
          return p;
        });
        console.log("App: Updated projects:", updated);
        return updated;
      });
    } else if (itemType === "project") {
      // Hitta projektet
      const project = allProjects.find((p) => p.id === itemId);
      if (!project) {
        console.error(`App: Project with ID ${itemId} not found`);
        return;
      }

      // Uppdatera projektets folder
      setAllProjects((prev) => {
        let updatedProjects = prev.filter((p) => p.id !== itemId);
        const updatedProject = { ...project, folder: newParentPath || "" };
        if (position !== null) {
          // Hitta projekt i samma mapp och sätt in på rätt position
          const sameFolderProjects = updatedProjects.filter((p) => p.folder === (newParentPath || ""));
          const otherProjects = updatedProjects.filter((p) => p.folder !== (newParentPath || ""));
          sameFolderProjects.splice(position, 0, updatedProject);
          updatedProjects = [...otherProjects, ...sameFolderProjects];
        } else {
          updatedProjects.push(updatedProject);
        }
        console.log("App: Updated projects:", updatedProjects);
        return updatedProjects;
      });
    }
  };

  const handleProjectCreate = (projectName, folder = "Allmänt") => {
    const newId = nextId;
    const newProject = { id: newId, name: projectName, folder, deadline: null, priority: null };

    setAllProjects((prev) => {
      const updated = [...prev, newProject];
      console.log("App: New project created:", newProject);
      console.log("App: Updated allProjects:", updated);
      return updated;
    });

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
      console.warn("App: Folder path cannot be empty");
      return;
    }

    if (folders.some((f) => f.name === folderPath)) {
      console.log("App: Folder already exists:", folderPath);
      return;
    }

    const newFolder = {
      id: nextFolderId,
      name: folderPath.trim(),
    };

    setFolders((prev) => {
      const updated = [...prev, newFolder];
      console.log("App: New folder created:", newFolder);
      console.log("App: Updated folders:", updated);
      return updated;
    });
    setNextFolderId((prev) => prev + 1);
  };

  const handleDeleteFolder = (folderPath) => {
    console.log(`App: Deleting folder with path: ${folderPath}`);
    setFolders((prev) => {
      const updated = prev.filter((folder) => {
        return folder.name !== folderPath && !folder.name.startsWith(`${folderPath}/`);
      });
      console.log("App: Updated folders:", updated);
      return updated;
    });

    setAllProjects((prev) => {
      const updated = prev.filter((project) => {
        return project.folder !== folderPath && !project.folder.startsWith(`${folderPath}/`);
      });
      console.log("App: Updated allProjects:", updated);
      return updated;
    });

    setTabs((prev) => {
      const updated = prev.filter((tab) => {
        const project = allProjects.find((p) => p.id === tab.id);
        return project && (project.folder !== folderPath && !project.folder.startsWith(`${folderPath}/`));
      });
      console.log("App: Updated tabs:", updated);
      return updated;
    });

    if (tabs.some((tab) => tab.id === activeTabId)) {
      const remaining = tabs.filter((tab) => {
        const project = allProjects.find((p) => p.id === tab.id);
        return project && (project.folder !== folderPath && !project.folder.startsWith(`${folderPath}/`));
      });
      setActiveTabId(remaining[0]?.id || null);
    }
  };

  const handleFolderRename = (oldPath, newName) => {
    console.log(`App: Attempting to rename folder from ${oldPath} to ${newName}`);

    if (!newName || !newName.trim()) {
      console.log("App: Folder name is empty");
      alert("Mappnamnet får inte vara tomt!");
      return;
    }

    if (newName.includes("/") || newName.includes("//")) {
      console.log("App: Invalid folder name with slashes");
      alert("Mappnamnet får inte innehålla '/' eller '//'!");
      return;
    }

    const pathParts = oldPath.split("/");
    pathParts[pathParts.length - 1] = newName.trim();
    const newPath = pathParts.join("/");

    if (folders.some((f) => f.name === newPath)) {
      console.log("App: Name conflict with", newName);
      alert(`En mapp med namnet "${newName}" finns redan på denna nivå!`);
      return;
    }

    setFolders((prev) => {
      const updated = prev.map((folder) => {
        console.log("App: Checking folder:", folder.name);
        if (folder.name === oldPath) {
          console.log("App: Updating folder name to:", newPath);
          return { ...folder, name: newPath };
        }
        if (folder.name.startsWith(`${oldPath}/`)) {
          const newFolderName = newPath + folder.name.slice(oldPath.length);
          console.log("App: Updating subfolder name to:", newFolderName);
          return { ...folder, name: newFolderName };
        }
        return folder;
      });
      console.log("App: Updated folders after rename:", updated);
      return updated;
    });

    setAllProjects((prev) => {
      const updated = prev.map((project) => {
        if (project.folder === oldPath) {
          console.log("App: Updating project folder to:", newPath);
          return { ...project, folder: newPath };
        }
        if (project.folder.startsWith(`${oldPath}/`)) {
          const newFolderPath = newPath + project.folder.slice(oldPath.length);
          console.log("App: Updating project subfolder to:", newFolderPath);
          return { ...project, folder: newFolderPath };
        }
        return project;
      });
      console.log("App: Updated allProjects after rename:", updated);
      return updated;
    });
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

  const handleProjectRename = (folderPath, oldName, newName) => {
    setAllProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.folder === folderPath && project.name === oldName
          ? { ...project, name: newName }
          : project
      )
    );
    setTabs((prev) =>
      prev.map((tab) =>
        tab.name === oldName && allProjects.find((p) => p.id === tab.id && p.folder === folderPath)
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
    console.log("App: Folder tree updated:", folderTree);
  }, [folderTree]);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  if (isLoading) return <PageLoader />;

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
              onFolderRename={handleFolderRename}
              onMoveItem={handleMoveItem}
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
