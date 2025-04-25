import React from "react";
import "../App.css"; // or wherever your CSS 
import { X } from "lucide-react";

export default function Topbar({ projectName, priority = "medium", onClose }) {
    return (
        <div className="topbar">
            <div className="topbar-content">
                <div className="tab">
                    Projekt 1
                    <button onClick={onClose} className="close-button" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>
                <div className="tab">
                    Projekt 2
                    <button onClick={onClose} className="close-button" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>
                <div className="tab">
                    Projekt 3
                    <button onClick={onClose} className="close-button" aria-label="Close" X size={20}>
                        <X size={20} />
                    </button>
                </div>
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
