import React from "react";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <input type="text" placeholder="Sök..." className="search" />
        <button className="filter-btn">Filter</button>
      </div>
      <div className="folder">
        <h4>Prio</h4>
        <ul>
          <li>Projekt 1</li>
          <li>Projekt 2</li>
          <li>Projekt 3</li>
        </ul>
      </div>
      <div className="folder">
        <h4>Sötvatten</h4>
        <ul>
          <li>Projekt 4</li>
          <li>Projekt 5</li>
        </ul>
      </div>
      <div className="folder">
        <h4>Marint</h4>
        <ul>
          <li>Projekt 6</li>
        </ul>
      </div>
    </div>
  );
}