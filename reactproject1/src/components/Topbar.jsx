import React from "react";
import "../App.css"; // or wherever your CSS lives

export default function Topbar({ projectName, priority = "medium" }) {
    return (
        <div className="topbar">
            <div className="topbar-content">
                <div className="tab">Projekt 1</div>
                <div className="tab">Projekt 2</div>
                <div className="tab">Projekt 3</div>
            </div>

            <div className="topbar-content-right">
                <div className={`priority-indicator ${priority}`} aria-label={`Priority: ${priority}`}></div>
                <h2 className="project-name">{projectName}</h2>

                <div className="project-meta">
                    <p className="project-other">Deadline: </p>
                    <p className="project-other">0/100 prover klara</p>
                    <p className="project-other">0 Kommentarer </p>
                </div>

            </div>
        </div>
    );
}
