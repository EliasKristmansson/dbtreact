import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import { X } from "lucide-react";
import logo from "../assets/Pelagia_Logotyp_Sekundar_Vit_RGB.svg"

export default function Topbar({
    projectName,
    deadline = "Ingen deadline",
    priority = "medium",
    tabs,
    rowCount,
    activeTabId,
    onTabClick,
    onTabClose,
    onTabRename,
    allProjects,
    commentCount = 0,
    greenFlagsCount = 0
}) {
    const [contextMenu, setContextMenu] = useState(null);
    const [renameValue, setRenameValue] = useState("");
    const inputRef = useRef();

    const [isRenaming, setIsRenaming] = useState(false);
    const [renameInput, setRenameInput] = useState(projectName);
    const renameInputRef = useRef(null);


    useEffect(() => {
	    if (isRenaming) {
	    	renameInputRef.current?.focus();
	    }
    }, [isRenaming]);


    // 🔹 Visa input automatiskt
    useEffect(() => {
        if (contextMenu) {
            inputRef.current?.focus();
        }
    }, [contextMenu]);

    // 🔹 Stäng menyn vid klick utanför
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenu && !e.target.closest(".rename-input")) {
                setContextMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [contextMenu]);

    const handleRightClick = (e, tab) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, tab });
        setRenameValue(tab.name);
    };

    const handleRenameSubmit = () => {
        if (renameValue.trim() && renameValue !== contextMenu.tab.name) {
            onTabRename(contextMenu.tab, renameValue.trim());
        }
        setContextMenu(null);
    };

    return (
        <div className="topbar">
            <div className="logo-container">
                <img src={logo} alt="Company Logo" className="topbar-logo" />
            </div>

            <div className="topbar-content">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`tab ${tab.id === activeTabId ? "active-tab" : ""}`}
                        onClick={() => onTabClick(tab.id)}
                        onContextMenu={(e) => handleRightClick(e, tab)}
                    >
                        {allProjects.find(p => p.id === tab.id)?.name || "Namnlös"}
                        <button
                            title="Stäng projekt"
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabClose(tab.id);
                            }}
                            className="close-button"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ))}

                {/* 🔹 Byt namn-popup */}
                {contextMenu && (
                    <input
                        className="rename-input"
                        ref={inputRef}
                        style={{
                            position: "fixed",
                            top: contextMenu.y,
                            left: contextMenu.x,
                            zIndex: 1000,
                        }}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameSubmit();
                            if (e.key === "Escape") setContextMenu(null);
                        }}
                        onBlur={() => setContextMenu(null)}
                    />
                )}
            </div>

            <div className="topbar-content-right">
                <div className={`priority-indicator ${priority}`} aria-label={`Priority: ${priority}`} />
                {isRenaming ? (
	<input
		ref={renameInputRef}
		className="rename-input"
		value={renameInput}
		onChange={(e) => setRenameInput(e.target.value)}
		onBlur={() => setIsRenaming(false)}
		onKeyDown={(e) => {
			if (e.key === "Enter") {
				const project = allProjects.find(p => p.id === activeTabId);
				if (project && renameInput.trim() !== project.name) {
					onTabRename(project, renameInput.trim());
				}
				setIsRenaming(false);
			} else if (e.key === "Escape") {
				setIsRenaming(false);
				setRenameInput(projectName);
			}
		}}
	/>
) : (
	<h2
		className="project-name"
		onDoubleClick={() => setIsRenaming(true)}
		title="Dubbelklicka för att byta namn"
	>
		{projectName}
	</h2>
)}

                <div className="project-meta">
                    <p className="project-other">Deadline: <span>{deadline}</span></p>
                    <p className="project-other">{greenFlagsCount}/{rowCount} prover klara</p>
                    <p className="project-other">{commentCount} Kommentarer</p>
                </div>
            </div>
        </div>
    );
}
