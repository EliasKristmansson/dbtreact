import React, { useState } from "react";
import "./Workspace.css";
import ConfirmModal from "./ConfirmModal";

export default function Workspace({ tabs, onNewProjectClick }) {
  const [rows, setRows] = useState([
    {
      märkning: "",
      inkommet: "",
      plockat: "",
      andelPlockat: "",
      datum: "",
      antalDjur: "",
      hemtagna: "",
      åter: "",
      kommentarer: ""
    }
  ]);

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // or "desc"

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSaveComment = (index) => {
    setPendingCommentIndex(index);
    setShowModal(true);
  };

  const confirmCommentSave = () => {
    setShowModal(false);
    setPendingCommentIndex(null);
  };

  const cancelCommentSave = () => {
    const updatedRows = [...rows];
    updatedRows[pendingCommentIndex].kommentarer = "";
    setRows(updatedRows);
    setShowModal(false);
    setPendingCommentIndex(null);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        märkning: "",
        inkommet: "",
        plockat: "",
        andelPlockat: "",
        datum: "",
        antalDjur: "",
        hemtagna: "",
        åter: "",
        kommentarer: ""
      }
    ]);
  };

  const removeRow = (indexToRemove) => {
    setRows(rows.filter((_, index) => index !== indexToRemove));
  };

  const sortRows = () => {
    if (!sortBy) return;
    const sorted = [...rows].sort((a, b) => {
      const valA = a[sortBy]?.toLowerCase?.() ?? a[sortBy];
      const valB = b[sortBy]?.toLowerCase?.() ?? b[sortBy];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setRows(sorted);
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <h2>Projekt 1</h2>
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
          <button className="add-btn" onClick={addRow}>+ Lägg till rad</button>
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
                <td><input type="text" value={row.märkning} onChange={(e) => handleChange(index, "märkning", e.target.value)} /></td>
                <td><input type="date" value={row.inkommet} onChange={(e) => handleChange(index, "inkommet", e.target.value)} /></td>
                <td><input type="date" value={row.plockat} onChange={(e) => handleChange(index, "plockat", e.target.value)} /></td>
                <td><input type="text" value={row.andelPlockat} onChange={(e) => handleChange(index, "andelPlockat", e.target.value)} /></td>
                <td><input type="date" value={row.datum} onChange={(e) => handleChange(index, "datum", e.target.value)} /></td>
                <td><input type="number" value={row.antalDjur} onChange={(e) => handleChange(index, "antalDjur", e.target.value)} /></td>
                <td><input type="date" value={row.hemtagna} onChange={(e) => handleChange(index, "hemtagna", e.target.value)} /></td>
                <td><input type="date" value={row.åter} onChange={(e) => handleChange(index, "åter", e.target.value)} /></td>
                <td><input type="text" value={row.kommentarer} onChange={(e) => handleChange(index, "kommentarer", e.target.value)} /></td>
                <td><button onClick={() => removeRow(index)}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
