import React from "react";

export default function Workspace() {
  return (
    <div className="workspace">
      <div className="workspace-header">
        <h2>Projekt 1</h2>
        <button className="add-btn">+ Lägg till</button>
      </div>
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
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ABC123</td>
            <td>2025-04-01</td>
            <td>Ja</td>
            <td>80%</td>
            <td>2025-04-02</td>
            <td>12</td>
            <td>Ja</td>
            <td>Nej</td>
            <td>Inga</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}