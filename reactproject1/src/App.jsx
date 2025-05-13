import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Workspace from "./components/Workspace";
import Filter from "./components/Filter";
import Statistik from "./components/Statistik";


export default function App() {
    const [allProjects, setAllProjects] = useState([
      { id: 1, name: "Projekt 1", folder: "Prio" },
      { id: 2, name: "Projekt 2", folder: "Prio" },
      { id: 3, name: "Projekt 3", folder: "Prio" },
      { id: 4, name: "Projekt 4", folder: "Sötvatten" },
      { id: 5, name: "Projekt 5", folder: "Sötvatten" },
      { id: 6, name: "Projekt 6", folder: "Marint" },
    ]);
    const [nextId, setNextId] = useState(7);

    const [tabs, setTabs] = useState([]);
    const [projectRows, setProjectRows] = useState({});
    const [activeTabId, setActiveTabId] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [viewMode, setViewMode] = useState("workspace"); // or "statistics"
    

    // 🔸 Skapa ett nytt projekt (lägger till i både allProjects och tabs)
    const handleProjectCreate = (projectName, folder = "Okategoriserad") => {
        const newId = nextId;
        const newProject = { id: newId, name: projectName, folder };

        setAllProjects(prev => [...prev, newProject]); // Lägg till i register
        setTabs(prev => [...prev, newProject]);        // Lägg till som tab
        setProjectRows(prev => ({ ...prev, [newId]: [] }));
        setActiveTabId(newId);
        setNextId(prev => prev + 1);
    };

    // 🔸 Öppna ett existerande projekt eller skapa en ny tab för det
    const handleProjectOpen = (projectName) => {
        const project = allProjects.find(p => p.name === projectName);
        if (!project) return;

        const existingTab = tabs.find(t => t.id === project.id);
        if (existingTab) {
            setActiveTabId(existingTab.id);
        } else {
            setTabs(prev => [...prev, project]);
            setActiveTabId(project.id);
        }

        // För säkerhets skull: om projektRows inte finns för projektet
        if (!projectRows[project.id]) {
            setProjectRows(prev => ({ ...prev, [project.id]: [] }));
        }
    };

    const handleProjectDelete = (folderName, projectIndex) => {
      // Filtrera fram alla projekt i just den foldern
      const projectsInFolder = allProjects.filter(p => p.folder === folderName);
  
      // Hämta det faktiska projektet vi vill ta bort
      const projectToDelete = projectsInFolder[projectIndex];
      if (!projectToDelete) return;
  
      // Uppdatera allProjects (ta bort projektet)
      const updatedProjects = allProjects.filter(p => p !== projectToDelete);
      setAllProjects(updatedProjects);
  
      // Stäng tabben om den är öppen
      if (projectToDelete.id !== undefined) {
          handleTabClose(projectToDelete.id);
      }
  };
  
  
  

    // 🔸 Stäng tab (inte från allProjects)
    const handleTabClose = (id) => {
        setTabs(prev => prev.filter(t => t.id !== id));
        setProjectRows(prev => {
            const newRows = { ...prev };
            delete newRows[id];
            return newRows;
        });
        if (activeTabId === id) {
            const remaining = tabs.filter(t => t.id !== id);
            setActiveTabId(remaining[0]?.id || null);
        }
    };

    // 🔸 Skapa tomt projekt från Workspace
    const handleNewProject = () => {
        handleProjectCreate("Projektnamn");
    };

    // 🔸 Radhantering
    const handleRowChange = (tabId, newRows) => {
        setProjectRows(prev => ({
            ...prev,
            [tabId]: newRows,
        }));
    };

    const handleAddRow = (tabId) => {
        setProjectRows(prev => ({
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
        setProjectRows(prev => ({
            ...prev,
            [tabId]: prev[tabId].filter((_, index) => index !== indexToRemove),
        }));
    };

    const activeTab = tabs.find(t => t.id === activeTabId);

    return (
        <div className="app">
            <Topbar
                projectName={activeTab ? activeTab.name : "Ingen Tab"}
                deadline="30 april 2025"
                priority="high"
                tabs={tabs}
                activeTabId={activeTabId}
                onTabClick={setActiveTabId}
                onTabClose={handleTabClose}
            />

<div className="main-content">
    {viewMode === "workspace" ? (
        <>
            <Sidebar
              allProjects={allProjects}
                onFilterClick={() => setShowFilter(true)}
                onProjectCreate={handleProjectCreate}
                onProjectDelete={handleProjectDelete}
                onProjectOpen={handleProjectOpen}
                onShowStatistics={() => setViewMode("statistics")}
            />
            <Workspace
                activeTabId={activeTabId}
                projectRows={projectRows}
                onChangeRow={handleRowChange}
                onAddRow={handleAddRow}
                onRemoveRow={handleRemoveRow}
                onNewProjectClick={handleNewProject}
                tabs={tabs}
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
