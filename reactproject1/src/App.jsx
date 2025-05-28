import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Workspace from "./components/Workspace";
import Filter from "./components/Filter";
import Statistik from "./components/Statistik";
import buildFolderTree from "./components/BuildFolderTree";
import Folder from "./components/Folder";
import PageLoader from "./components/PageLoader"; // ny loader komponent

export default function App() {
	const [allProjects, setAllProjects] = useState([
		{ id: 1, name: "Projekt 1", folder: "Prio", date: "2024-10-01" },
		{ id: 2, name: "Projekt 2", folder: "Prio/Sub1" },
		{ id: 3, name: "Projekt 3", folder: "Prio/Sub1" },
		{ id: 4, name: "Projekt 4", folder: "Sötvatten" },
		{ id: 5, name: "Projekt 5", folder: "Sötvatten/Undermapp" },
		{ id: 6, name: "Projekt 6", folder: "Marint" },
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
	const [isLoading, setIsLoading] = useState(true);




	useEffect(() => {
		const timeout = setTimeout(() => setIsLoading(false), 5000);
		return () => clearTimeout(timeout);
	}, []);

	const handleProjectCreate = (projectName, folder = "Okategoriserad") => {
		const newId = nextId;
		const newProject = {
			id: newId,
			name: projectName,
			folder,
			date: new Date().toISOString().split("T")[0],
		};

		setAllProjects(prev => [...prev, newProject]);
		setTabs(prev => [...prev, { id: newId }]);
		setProjectRows(prev => ({ ...prev, [newId]: [] }));
		setActiveTabId(newId);
		setNextId(prev => prev + 1);
		setFolders(prev => prev.includes(folder) ? prev : [...prev, folder]);
	};

	const handleProjectOpen = (projectName) => {
		const project = allProjects.find(p => p.name === projectName);
		if (!project) return;

		const existingTab = tabs.find(t => t.id === project.id);
		if (existingTab) {
			setActiveTabId(existingTab.id);
		} else {
			setTabs(prev => [...prev, { id: project.id }]);
			setActiveTabId(project.id);
		}

		if (!projectRows[project.id]) {
			setProjectRows(prev => ({ ...prev, [project.id]: [] }));
		}
	};

	const handleProjectDelete = (folderName, projectIndex) => {
		const projectsInFolder = allProjects.filter(p => p.folder === folderName);
		const projectToDelete = projectsInFolder[projectIndex];
		if (!projectToDelete) return;
		const updatedProjects = allProjects.filter(p => p !== projectToDelete);
		setAllProjects(updatedProjects);
		if (projectToDelete.id !== undefined) {
			handleTabClose(projectToDelete.id);
		}
	};

	const handleAddFolder = (newFolderName) => {
		if (!folders.includes(newFolderName)) {
			setFolders(prev => [...prev, newFolderName]);
		}
	};

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

	const handleNewProject = () => {
		handleProjectCreate("Projektnamn");
	};

	const handleRowChange = (tabId, newRows) => {
		setProjectRows(prev => ({ ...prev, [tabId]: newRows }));
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

	const handleProjectRename = (folderName, oldName, newName) => {
		setAllProjects(prevProjects =>
			prevProjects.map(project =>
				project.folder === folderName && project.name === oldName
					? { ...project, name: newName }
					: project
			)
		);
	};

	const activeTab = tabs.find(t => t.id === activeTabId);

	if (isLoading) return <PageLoader />;

	return (
		<div className="app">
			<Topbar
				projectName={activeTab ? allProjects.find(p => p.id === activeTab.id)?.name || "Ingen tab" : ""}
				deadline="30 april 2025"
				priority="high"
				tabs={tabs}
				activeTabId={activeTabId}
				rowCount={rowCount}
				greenFlagsCount={greenFlagsCount}
				onTabClick={setActiveTabId}
				onTabClose={handleTabClose}
				allProjects={allProjects}
				commentCount={commentCount}
				onTabRename={(tab, newName) => {
					const project = allProjects.find(p => p.id === tab.id);
					if (project) {
						handleProjectRename(project.folder, project.name, newName);
					}
				}}
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
