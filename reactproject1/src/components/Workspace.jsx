import React, { useState } from "react";
import "./Workspace.css";
import ConfirmModal from "./ConfirmModal";

export default function Workspace() {
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
      kommentarer: "",
      flag: ""    // ✅ Kommatecken fixat
    }
  ]);

  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pendingCommentIndex, setPendingCommentIndex] = useState(null);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const toggleFlag = (index) => {
    const updatedRows = [...rows];
    const currentFlag = updatedRows[index].flag;
    let newFlag = "";
    if (currentFlag === "") newFlag = "green";
    else if (currentFlag === "green") newFlag = "yellow";
    else if (currentFlag === "yellow") newFlag = "red";
    else if (currentFlag === "red") newFlag = "";
    updatedRows[index].flag = newFlag;
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
        kommentarer: "",
        flag: ""    // ✅ Kommatecken fixat
      }
    ]);
  };

  const removeRow = (indexToRemove) => {
    setRows(rows.filter((_, index) => index !== indexToRemove));
  };

  const filteredRows = rows.filter(row => {
    if (filter === "intePlockade") return !row.plockat;
    if (filter === "flaggade") return !row.andelPlockat;
    if (filter === "kommenterade") return row.kommentarer?.trim();
    return true;
  });

  return (
    <div className="workspace">
      <div className="workspace-header">
        <h2>Projekt 1</h2>

        <div className="filter-buttons" style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
          <button onClick={() => setFilter("intePlockade")}>Inte plockade</button>
          <button onClick={() => setFilter("flaggade")}>Flaggade</button>
          <button onClick={() => setFilter("kommenterade")}>Kommenterade</button>
          <button onClick={() => setFilter("")}>Rensa filter</button>
          <button className="add-btn" onClick={addRow}>+ Lägg till rad</button>
        </div>
      </div>

      <div className="table-container">
        <table className="project-table">
          <thead>
            <tr>
              <th>Flagga</th> {/* Lägg till en kolumn för flag-knapparna */}
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
          {filteredRows.map((row, index) => (
            <tr key={index} className="row-wrapper">
              <td className="flag-container">
                <button 
                  className={`flag-button ${row.flag}`} 
                  onClick={() => toggleFlag(index)}
                ></button>
              </td>
              <td><input type="text" value={row.märkning} onChange={(e) => handleChange(index, "märkning", e.target.value)} /></td>
              <td><input type="date" value={row.inkommet} onChange={(e) => handleChange(index, "inkommet", e.target.value)} /></td>
              <td><input type="date" value={row.plockat} onChange={(e) => handleChange(index, "plockat", e.target.value)} /></td>
              <td><input type="text" value={row.andelPlockat} onChange={(e) => handleChange(index, "andelPlockat", e.target.value)} /></td>
              <td><input type="date" value={row.datum} onChange={(e) => handleChange(index, "datum", e.target.value)} /></td>
              <td>
                <div className="antal-djur-inputs">
                  <input
                    type="text"
                    placeholder="123"
                    value={row.antalDjur?.split('/')[0] || ""}
                    onChange={(e) => {
                      const andra = row.antalDjur?.split('/')[1] || "";
                      handleChange(index, "antalDjur", `${e.target.value}/${andra}`);
                    }}
                  />
                  <span>/</span>
                  <input
                    type="text"
                    placeholder="456"
                    value={row.antalDjur?.split('/')[1] || ""}
                    onChange={(e) => {
                      const första = row.antalDjur?.split('/')[0] || "";
                      handleChange(index, "antalDjur", `${första}/${e.target.value}`);
                    }}
                  />
                </div>
              </td>
              <td><input type="date" value={row.hemtagna} onChange={(e) => handleChange(index, "hemtagna", e.target.value)} /></td>
              <td><input type="date" value={row.åter} onChange={(e) => handleChange(index, "åter", e.target.value)} /></td>
              <td>
                <textarea
                  value={row.kommentarer}
                  onChange={(e) => handleChange(index, "kommentarer", e.target.value)}
                  onBlur={() => handleSaveComment(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveComment(index);
                    }
                  }}
                  rows="2"
                  placeholder="Skriv kommentar..."
                />
              </td>
              <td><button onClick={() => removeRow(index)}>🗑️</button></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={showModal}
        message="Vill du spara kommentaren?"
        onConfirm={confirmCommentSave}
        onCancel={cancelCommentSave}
      />
    </div>
  );
}
