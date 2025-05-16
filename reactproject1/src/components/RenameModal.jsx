import React, { useState, useEffect } from "react";

export default function RenameModal({ currentName, onConfirm, onCancel }) {
    const [newName, setNewName] = useState(currentName);

    useEffect(() => {
        setNewName(currentName);
    }, [currentName]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName && newName !== currentName) {
            onConfirm(currentName, newName);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Byt namn på projekt</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                    />
                    <div className="modal-buttons">
                        <button type="submit">Spara</button>
                        <button type="button" onClick={onCancel}>
                            Avbryt
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
