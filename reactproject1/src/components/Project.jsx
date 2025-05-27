import React, { useState, useEffect, useRef } from "react";
import RenameModal from "./RenameModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";

export default function Project({
  name,
  deadline,
  priority,
  onDoubleClick,
  onDelete,
  onRename,
  onDeadlineChange,
  onPriorityChange,
  className,
  projectId,
  activeTabId,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [isClosingPriorityMenu, setIsClosingPriorityMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [datePickerPosition, setDatePickerPosition] = useState({ x: 0, y: 0 });
  const datePickerRef = useRef(null);
  const priorityMenuRef = useRef(null);

  useEffect(() => {
    if (deadline) {
      try {
        const parsedDate = parseISO(deadline);
        if (!isNaN(parsedDate)) {
          setSelectedDate(parsedDate);
        } else {
          setSelectedDate(null);
        }
      } catch {
        setSelectedDate(null);
      }
    } else {
      setSelectedDate(null);
    }
  }, [deadline]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    console.log("Context menu triggered for project:", { name, projectId, className, isClosingPriorityMenu });
    setSelectedProject(name);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleChangeDeadline = () => {
    setDatePickerPosition(contextMenu);
    setShowDatePicker(true);
    setContextMenu(null);
  };

  const handleDelete = () => {
    onDelete(selectedProject);
    setContextMenu(null);
  };

  const handleRename = () => {
    setShowRenameModal(true);
    setContextMenu(null);
  };

  const handlePriority = () => {
    setShowPriorityMenu(true);
  };

  const closeRenameModal = () => {
    setShowRenameModal(false);
  };

  const handleRenameConfirm = (oldName, newName) => {
    onRename(oldName, newName);
    setShowRenameModal(false);
  };

  const closeContextMenu = () => {
    if (showPriorityMenu) {
      setIsClosingPriorityMenu(true);
      setShowPriorityMenu(false);
      setContextMenu(null);
    } else {
      setContextMenu(null);
    }
  };

  const handleClickOutside = (e) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(e.target)
    ) {
      setShowDatePicker(false);
    }
    if (
      priorityMenuRef.current &&
      !priorityMenuRef.current.contains(e.target)
    ) {
      setShowPriorityMenu(false);
      setContextMenu(null);
      setIsClosingPriorityMenu(false);
    }
  };

  useEffect(() => {
    if (showDatePicker || showPriorityMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      setIsClosingPriorityMenu(false);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker, showPriorityMenu]);

  const handleClearDeadline = () => {
    setSelectedDate(null);
    onDeadlineChange(projectId, "");
    setShowDatePicker(false);
  };

  return (
    <div className={className} id="project-container">
      <li
        onDoubleClick={() => onDoubleClick(name)}
        onContextMenu={handleContextMenu}
      >
        <span>
          <span
            className={`priority-indicator ${priority || "none"}`}
            style={priority === null ? { border: "1px solid #000000" } : {}}
          />
          {name}
        </span>
        <span className="project-date">
          {selectedDate
            ? selectedDate.toLocaleDateString("sv-SE")
            : "Ingen deadline"}
        </span>
      </li>

      {contextMenu && !showPriorityMenu && !isClosingPriorityMenu && (
        <div
          className="context-menu"
          style={{
            marginTop: "100px",
            left: contextMenu.x,
            position: "absolute",
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            padding: "5px 0",
            borderRadius: "4px",
            width: "115px",
          }}
        >
          <li
            style={{ padding: "6px 12px", cursor: "pointer" }}
            onClick={handleRename}
          >
            Byt namn
          </li>
          <li
            style={{ padding: "6px 12px", cursor: "pointer" }}
            onClick={handleChangeDeadline}
          >
            Byt deadline
          </li>
          <li
            style={{ padding: "6px 12px", cursor: "pointer" }}
            onClick={handlePriority}
          >
            Byt prioritet
          </li>
          <li
            style={{ padding: "6px 12px", cursor: "pointer" }}
            onClick={handleDelete}
          >
            Ta bort
          </li>
        </div>
      )}

      {showPriorityMenu && (
        <div
          ref={priorityMenuRef}
          className="context-menu"
          style={{
            top: contextMenu ? contextMenu.y - 95 : 0,
            left: contextMenu ? contextMenu.x : 0,
            position: "absolute",
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            padding: "5px 0",
            borderRadius: "4px",
            width: "115px",
          }}
        >
          <li
            style={{ padding: "6px 12px", cursor: "pointer" }}
            onClick={() => {
              onPriorityChange(projectId, "high");
              setShowPriorityMenu(false);
              setContextMenu(null);
            }}
          >
            🔴 Hög
          </li>
          <li
            style={{ padding: "6px 12px", cursor: "pointer" }}
            onClick={() => {
              onPriorityChange(projectId, "medium");
              setShowPriorityMenu(false);
              setContextMenu(null);
            }}
          >
            🟡 Medium
          </li>
          <li
            style={{ padding: "6px 12px", cursor: "pointer" }}
            onClick={() => {
              onPriorityChange(projectId, "low");
              setShowPriorityMenu(false);
              setContextMenu(null);
            }}
          >
            🟢 Låg
          </li>
          <li
            style={{ padding: "6px 12px", cursor: "pointer" }}
            onClick={() => {
              onPriorityChange(projectId, null);
              setShowPriorityMenu(false);
              setContextMenu(null);
            }}
          >
            ⚪ Ingen
          </li>
        </div>
      )}

      {(contextMenu || showPriorityMenu) && (
        <div className="overlay" onClick={closeContextMenu}></div>
      )}

      {showRenameModal && (
        <RenameModal
          currentName={selectedProject}
          onConfirm={handleRenameConfirm}
          onCancel={closeRenameModal}
        />
      )}

      {showDatePicker && (
        <div
          ref={datePickerRef}
          style={{
            position: "absolute",
            top: datePickerPosition.y,
            left: datePickerPosition.x,
            zIndex: 9999,
            marginTop: "-70px",
          }}
        >
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              onDeadlineChange(
                projectId,
                date ? date.toLocaleDateString("sv-SE") : ""
              );
              setShowDatePicker(false);
            }}
            inline
            dateFormat="yyyy-MM-dd"
            renderCustomHeader={({
              monthDate,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="custom-datepicker-header">
                <div
                  className="datepicker-title"
                  onClick={handleClearDeadline}
                >
                  Ingen deadline
                </div>
                <div className="month-navigation">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                  >
                    {"<"}
                  </button>
                  <span>
                    {monthDate.toLocaleString("sv-SE", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                  >
                    {">"}
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}