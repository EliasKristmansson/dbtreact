import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Workspace from "./components/Workspace";
import Filter from "./components/Filter";

export default function App() {
  const [showFilter, setShowFilter] = useState(false);

  const [tabs, setTabs] = useState([
    { id: 1, name: "Projekt 1" },
    { id: 2, name: "Projekt 2" },
    { id: 3, name: "Projekt 3" },
  ]);

  const [nextId, setNextId] = useState(4); // för unika id:n

  const handleTabClose = (id) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
  };

  const handleNewProject = () => {
    const newTab = { id: nextId, name: "Projektnamn" };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setNextId((prev) => prev + 1);
  };

  return (
    <div className="app">
      <Topbar
        projectName="Projekt Streamline"
        deadline="30 april 2025" // <- valfri sträng här!
        priority="high"
        tabs={tabs}
        onTabClose={handleTabClose}

      />

      <div className="main-content">
        <Sidebar onFilterClick={() => setShowFilter(true)} />
        <Workspace tabs={tabs} onNewProjectClick={handleNewProject} />
      </div>

      <Filter
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onFilter={() => {
          setShowFilter(false);
        }}
      />
    </div>
  );
}
