import React from "react";
import "./Workspace.css";
import "./confirmModal.css";

export default function Workspace({ activeTabId, projectRows, onChangeRow, onAddRow, onRemoveRow, onNewProjectClick, tabs }) {
    const rows = projectRows[activeTabId] || [];

    const showEmpty = tabs.length === 0;

    const [sortBy, setSortBy] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState("asc");

    const sortRows = () => {
        if (!sortBy) return;
        const sorted = [...rows].sort((a, b) => {
            const valA = a[sortBy]?.toLowerCase?.() ?? a[sortBy];
            const valB = b[sortBy]?.toLowerCase?.() ?? b[sortBy];
            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        onChangeRow(activeTabId, sorted);
    };

    if (showEmpty) {
        return (
            <div className="workspace">
                <div className="new-project">
                    <button className="new-project-btn" onClick={onNewProjectClick}>+ Nytt projekt</button>
                </div>
            </div>
        );
    }

    return (
        <div className="workspace">
            <div className="workspace-header">
                <h2>{tabs.find(t => t.id === activeTabId)?.name}</h2>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="">Sortera efter...</option>
                        <option value="märkning">Märkning</option>
                        <option value="inkommet">Inkommet</option>
                        <option value="plockat">Plockat</option>
                        <option value="datum">Provtaget datum</option>
                        <option value="antalDjur">Antal djur</option>
                        <option value="hemtagna">Prover hemtagna</option>
                        <option value="åter">Prover åter</option>
                    </select>
                    <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                        {sortOrder === "asc" ? "⬆️" : "⬇️"}
                    </button>
                    <button className="add-btn" onClick={sortRows}>Sortera</button>
                    <button className="add-btn" onClick={() => onAddRow(activeTabId)}>+ Lägg till rad</button>
                </div>
            </div>

            <div className="table-container">
                <table className="project-table">
                    <thead>
                        <tr>
                            <th>Märkning</th>
                            <th>Inkommet</th>
                            <th>Plockat</th>
                            <th>Andel plockat</th>
                            <th>Provtaget datum</th>
                            <th>Antal djur</th>
                            <th>Prover hemtagna</th>
                            <th>Prover åter</th>
                            <th>Övriga kommentarer</th>
                            <th>Ta bort</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                {["märkning", "inkommet", "plockat", "andelPlockat", "datum", "antalDjur", "hemtagna", "åter", "kommentarer"].map((field) => (
                                    <td key={field}>
                                        <input
                                            type={field.includes("datum") || field.includes("inkommet") || field.includes("plockat") || field.includes("åter") || field.includes("hemtagna") ? "date" : field === "antalDjur" ? "number" : "text"}
                                            value={row[field]}
                                            onChange={(e) => {
                                                const updated = [...rows];
                                                updated[index][field] = e.target.value;
                                                onChangeRow(activeTabId, updated);
                                            }}
                                        />
                                    </td>
                                ))}
                                <td>
                                    <button onClick={() => onRemoveRow(activeTabId, index)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
