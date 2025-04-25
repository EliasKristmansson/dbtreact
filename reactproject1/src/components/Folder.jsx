import React, { useState } from "react";
import Project from "./Project.jsx";

export default function Folder({ title, projects, addProject }) {
  const [newProject, setNewProject] = useState("");

  const handleAddProject = () => {
    if (newProject) {
      addProject(newProject); // Anropar addProject från Sidebar-komponenten
      setNewProject(""); // Tömmer inputfältet efter tillägg
    }
  };

  return (
    <div className="folder">
      <h4>{title}</h4>
      <ul>
        {projects.map((proj, idx) => (
          <Project key={idx} name={proj} />
        ))}
      </ul>
    </div>
  );
}
