import React from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Workspace from "./components/Workspace";

export default function App() {
  return (
    <div className="app">
      <Topbar />
      <div className="main-content">
        <Sidebar />
        <Workspace />
      </div>
    </div>
  );
}