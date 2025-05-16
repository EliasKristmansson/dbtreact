import React, { useState } from "react";
import "./Workspace.css";
import ConfirmModal from "./confirmModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";
import { Calendar } from "lucide-react";

export default function Workspace({ tabs, activeTabId, onNewProjectClick }) {
  const [projectData, setProjectData] = useState({});
  const [filterMap, setFilterMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [pendingCommentIndex, setPendingCommentIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
  const todayStr = new Date().toISOString().split("T")[0];

  if (!projectData[activeTabId]) {
    setProjectData((prev) => ({
      ...prev,
      [activeTabId]: [
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
          flag: "",
        },
      ],
    }));
  }

  const rows = projectData[activeTabId] || [];
  const filters = filterMap[activeTabId] || [];

  const updateProjectRows = (newRows) => {
    setProjectData((prev) => ({ ...prev, [activeTabId]: newRows }));
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    updateProjectRows(updatedRows);
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
    updateProjectRows(updatedRows);
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
    updateProjectRows(updatedRows);
    setShowModal(false);
    setPendingCommentIndex(null);
  };

  const addRow = () => {
    updateProjectRows([
      ...rows,
      {
        märkning: "",
        inkommet: todayStr,
        plockat: todayStr,
        andelPlockat: "",
        datum: todayStr,
        antalDjur: "",
        hemtagna: todayStr,
        åter: todayStr,
        kommentarer: "",
        flag: "",
      },
    ]);
  };

  const confirmDelete = () => {
    const updatedRows = rows.filter((_, index) => index !== pendingDeleteIndex);
    updateProjectRows(updatedRows);
    setPendingDeleteIndex(null);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setPendingDeleteIndex(null);
    setShowDeleteModal(false);
  };

  const filteredRows = rows.filter((row) => {
    return filters.every((filter) => {
      switch (filter) {
        case "intePlockade":
          return !row.plockat?.trim();
        case "flaggade":
          return ["green", "yellow", "red"].includes(row.flag);
        case "kommenterade":
          return !!row.kommentarer?.trim();
        default:
          return true;
      }
    });
  });

  const handleSetFilter = (filter) => {
    setFilterMap((prev) => {
      const currentFilters = prev[activeTabId] || [];
      const newFilters = currentFilters.includes(filter)
        ? currentFilters.filter((f) => f !== filter)
        : [...currentFilters, filter];
      return { ...prev, [activeTabId]: newFilters };
    });
  };

  const clearFilters = () => {
    setFilterMap((prev) => ({ ...prev, [activeTabId]: [] }));
  };

  const CalendarInput = React.forwardRef(({ value, onClick }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      className="calendar-input"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "25px",
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0 0 0 1px #ccc",
        borderRadius: "4px",
        cursor: "pointer",
        boxSizing: "border-box",
        padding: "0 5px",
        fontSize: "12px",
        color: "#333",
      }}
    >
      <span
        style={{
          marginRight: "8px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value || todayStr}
      </span>
      <Calendar size={16} style={{ flexShrink: 0 }} />
    </div>
  ));

  CalendarInput.displayName = "CalendarInput";

  const markProjectAsDone = () => {
    const currentTab = tabs.find((tab) => tab.id === activeTabId);
    const completionData = {
      date: new Date().toISOString(),
      name: currentTab?.name || "Okänt projekt",
    };
    const prev = JSON.parse(localStorage.getItem("completedProjects") || "[]");
    localStorage.setItem("completedProjects", JSON.stringify([...prev, completionData]));
    alert(`Projekt "${completionData.name}" markerat som klart och sparat i statistiken!`);
  };

  const showEmpty = tabs.length === 0;

  return (
    <div className="workspace">
      {showEmpty ? (
        <div className="new-project">
          <button className="new-project-btn" onClick={onNewProjectClick}>
            + Nytt projekt
          </button>
        </div>
      ) : (
        <>
          <div className="workspace-header">
            <div className="filter-buttons">
              <button onClick={() => handleSetFilter("intePlockade")}
                className={filters.includes("intePlockade") ? "active-filter" : ""}>
                Inte plockade
              </button>
              <button onClick={() => handleSetFilter("flaggade")}
                className={filters.includes("flaggade") ? "active-filter" : ""}>
                Flaggade
              </button>
              <button onClick={() => handleSetFilter("kommenterade")}
                className={filters.includes("kommenterade") ? "active-filter" : ""}>
                Kommenterade
              </button>
              <button className="rensa-filter-btn" onClick={clearFilters}>
                Rensa filter
              </button>
              <button className="add-btn" onClick={addRow}>
                + Lägg till rad
              </button>
              <button className="complete-project-btn" onClick={markProjectAsDone}>
                ✔ Projekt klart
              </button>
            </div>
          </div>
          {/* Table rendering remains unchanged */}
        </>
      )}

      {showModal && (
        <ConfirmModal
          isOpen={showModal}
          message="Är du säker på att du vill spara kommentaren?"
          onConfirm={confirmCommentSave}
          onCancel={cancelCommentSave}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          message="Är du säker på att du vill ta bort raden?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}