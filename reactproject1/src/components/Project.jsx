import React, { useState } from "react";
import RenameModal from "./RenameModal";

export default function Project({ name, onDoubleClick, onDelete, onRename, className }) {
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showRenameModal, setShowRenameModal] = useState(false);

    const handleContextMenu = (e) => {
        e.preventDefault();
        setSelectedProject(name);
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleDelete = () => {
        onDelete(selectedProject);
        setContextMenu(null);
    };

    const handleRename = () => {
        setShowRenameModal(true);
        setContextMenu(null);
    };

    const closeRenameModal = () => {
        setShowRenameModal(false);
    };

    const handleRenameConfirm = (oldName, newName) => {
        onRename(oldName, newName);
        setShowRenameModal(false);
    };

    const closeContextMenu = () => {
        setContextMenu(null);
    };

    return (
        <div className={className}>
            <li
                onDoubleClick={() => onDoubleClick(name)}
                onContextMenu={handleContextMenu}
            >
                {name}
            </li>

            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <li onClick={handleRename}>Byt namn</li>
                    <li onClick={handleDelete}>Ta bort</li>
                </div>
            )}

            {contextMenu && <div className="overlay" onClick={closeContextMenu}></div>}

            {showRenameModal && (
                <RenameModal
                    currentName={selectedProject}
                    onConfirm={handleRenameConfirm}
                    onCancel={closeRenameModal}
                />
            )}
        </div>
    );
}
