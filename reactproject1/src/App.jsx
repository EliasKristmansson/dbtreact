import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Workspace from "./components/Workspace";
import Filter from "./components/Filter"; // Importera filtret

export default function App() {
  const [showFilter, setShowFilter] = useState(false); // State för att visa/dölja filtret

  return (
    <div className="app">
      <Topbar
        projectName="Projekt Streamline"
        priority="high"
        onFilterClick={() => setShowFilter(true)} // Skicka med funktionen till Topbar
      />

      <div className="main-content">
        <Sidebar onFilterClick={() => setShowFilter(true)} /> {/* Skicka funktionen till Sidebar */}
        <Workspace />
      </div>

      <Filter
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onFilter={() => {
          // Lägg in filtreringslogik här om du vill hantera det i App.jsx
          setShowFilter(false);
        }}
      />
    </div>
  );
}
