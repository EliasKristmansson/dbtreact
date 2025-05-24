import React, { useState } from "react";

export default function RenameModal({ currentName, onConfirm, onCancel }) {
    const [newName, setNewName] = useState(""); // Tom sträng istället för currentName

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
                        placeholder="Nytt projektnamn" // Lägg till placeholder
                        autoFocus
                        className="rename-input" // Lägg till klass för styling
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