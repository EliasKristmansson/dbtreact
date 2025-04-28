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
    const [nextId, setNextId] = useState(4);
    const [activeTabId, setActiveTabId] = useState(1);

    const [projectRows, setProjectRows] = useState({
        1: [],
        2: [],
        3: [],
    });

    const handleTabClose = (id) => {
        setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
        setProjectRows((prevRows) => {
            const newRows = { ...prevRows };
            delete newRows[id];
            return newRows;
        });
        if (activeTabId === id && tabs.length > 1) {
            const remainingTabs = tabs.filter(tab => tab.id !== id);
            setActiveTabId(remainingTabs[0]?.id || null);
        }
    };

    const handleNewProject = () => {
        const newId = nextId;
        const newTab = { id: newId, name: "Projektnamn" };
        setTabs((prevTabs) => [...prevTabs, newTab]);
        setProjectRows((prev) => ({ ...prev, [newId]: [] }));
        setActiveTabId(newId);
        setNextId((prev) => prev + 1);
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

    return (
        <div className="app">
            <Topbar
                projectName="Projekt Streamline"
                deadline="30 april 2025"
                priority="high"
                tabs={tabs}
                activeTabId={activeTabId}
                onTabClick={setActiveTabId}
                onTabClose={handleTabClose}
            />

            <div className="main-content">
                <Sidebar onFilterClick={() => setShowFilter(true)} />
                <Workspace
                    activeTabId={activeTabId}
                    projectRows={projectRows}
                    onChangeRow={handleRowChange}
                    onAddRow={handleAddRow}
                    onRemoveRow={handleRemoveRow}
                    onNewProjectClick={handleNewProject}
                    tabs={tabs}
                />
            </div>

            <Filter
                isOpen={showFilter}
                onClose={() => setShowFilter(false)}
                onFilter={() => setShowFilter(false)}
            />
        </div>
    );
}
