import React, { useState, useEffect } from "react";
import "./Workspace.css";
import ConfirmModal from "./confirmModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";
import CrazyButton from "./Crazybutton.jsx";

export default function Workspace({
  tabs,
  activeTabId,
  onNewProjectClick,
  setCommentCount,
  onRowCount,
  onGreenFlagsCount,
  allProjects,
}) {
  const [projectData, setProjectData] = useState({});
  const [filterMap, setFilterMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [pendingCommentIndex, setPendingCommentIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
  const todayStr = new Date().toISOString().split("T")[0];

  // Initialize projectData for activeTabId if it doesn't exist
  if (!projectData[activeTabId]) {
    setProjectData((prev) => ({
      ...prev,
      [activeTabId]: [
        {
          märkning: "",
          datum: "",
          inkommet: "",
          antalvialer: "",
          plockat: "",
          andelPlockat: "",
          artat: "",
          artatdatum: "",
          antalDjur: "",
          hemtagna: "",
          åter: "",
          kommentarer: "",
          fel: "",
          flag: "red",
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
    const flagCycle = ["red", "orange", "yellow", "green", "blue"];
    const currentIndex = flagCycle.indexOf(currentFlag);
    const nextIndex = (currentIndex + 1) % flagCycle.length;

    updatedRows[index].flag = flagCycle[nextIndex];
    updateProjectRows(updatedRows);
  };

  useEffect(() => {
    const rows = projectData[activeTabId] || [];
    onRowCount(rows.length);
    if (showModal) return;

    const greenFlagsCount = rows.filter((row) => row.flag === "green" || row.flag === "blue").length;
    onGreenFlagsCount(greenFlagsCount);

    const count = rows.filter((row) => row.kommentarer?.trim()).length;
    setCommentCount(count);
  }, [projectData, activeTabId, showModal, setCommentCount, onGreenFlagsCount, onRowCount]);

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

  const colorOptions = [
    { color: "red", label: "Ej plockat" },
    { color: "orange", label: "Plockat" },
    { color: "yellow", label: "Artat" },
    { color: "green", label: "Fakturerat" },
    { color: "blue", label: "Ok att hälla ut" },
  ];

  const felAlternativ = [
    "Fel i leverans",
    "Dåligt med etanol",
    "För lite material",
    "För mycket material",
    "Dåligt konserverat",
    "Mycket dåligt konserverat",
    "För gammalt prov",
    "Annat fel",
  ];

  const addRow = () => {
    updateProjectRows([
      ...rows,
      {
        märkning: "",
        datum: "",
        inkommet: "",
        antalvialer: "",
        plockat: "",
        andelPlockat: "",
        artat: "",
        artatdatum: "",
        antalDjur: "",
        hemtagna: "",
        åter: "",
        kommentarer: "",
        fel: "",
        flag: "red",
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
    const flagFilters = filters.filter((f) => f.startsWith("flag-"));
    if (flagFilters.length > 0) {
      const flagColors = flagFilters.map((f) => f.split("flag-")[1]);
      if (!flagColors.includes(row.flag)) {
        return false;
      }
    }

    return filters
      .filter((f) => !f.startsWith("flag-"))
      .every((filter) => {
        switch (filter) {
          case "intePlockade":
            return !row.plockat?.trim();
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

  const handleToggleFlagFilter = (color) => {
    const filterName = `flag-${color}`;
    setFilterMap((prev) => {
      const currentFilters = prev[activeTabId] || [];
      const newFilters = currentFilters.includes(filterName)
        ? currentFilters.filter((f) => f !== filterName)
        : [...currentFilters, filterName];
      return { ...prev, [activeTabId]: newFilters };
    });
  };

  const clearFlagFilters = () => {
    setFilterMap((prev) => ({
      ...prev,
      [activeTabId]: prev[activeTabId]?.filter((f) => !f.startsWith("flag-")) || [],
    }));
  };

  const clearFilters = () => {
    setFilterMap((prev) => ({
      ...prev,
      [activeTabId]: [],
    }));
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
        color: value ? "#333" : "#888888", // Svart för valt datum, ljusgrå för placeholder
      }}
    >
      <span>{value || "Välj datum"}</span>
    </div>
  ));

  CalendarInput.displayName = "CalendarInput";

  const markProjectAsDone = () => {
    const currentProject = allProjects.find((project) => project.id === activeTabId);
    const completionData = {
      date: new Date().toISOString(),
      name: currentProject?.name || "Okänt projekt",
    };
    const prev = JSON.parse(localStorage.getItem("completedProjects") || "[]");
    localStorage.setItem("completedProjects", JSON.stringify([...prev, completionData]));
    alert(`Projekt "${completionData.name}" markerat som klart och sparat i statistiken!`);
  };

  const showEmpty = tabs.length === 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "q") {
        e.preventDefault();
        addRow();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [addRow, rows]);

  return (
    <div className="workspace">
      {showEmpty ? (
        <div className="new-project">
          <CrazyButton onClick={onNewProjectClick} />
        </div>
      ) : (
        <>
          <div className="workspace-header">
            <div className="filter-buttons">
              <button
                onClick={() => handleSetFilter("intePlockade")}
                className={filters.includes("intePlockade") ? "active-filter" : ""}
              >
                Inte plockade
              </button>
              <div
                className="flag-filter-container"
                onClick={() => {
                  if (filters.some((f) => f.startsWith("flag-"))) {
                    clearFlagFilters();
                  }
                }}
              >
                <button
                  className={filters.some((f) => f.startsWith("flag-")) ? "active-filter" : ""}
                  onClick={(e) => e.stopPropagation()}
                >
                  Flaggning {filters.some((f) => f.startsWith("flag-")) ? "✓" : "▼"}
                </button>
                <div className="flag-filter-dropdown" onClick={(e) => e.stopPropagation()}>
                  {colorOptions.map(({ color, label }) => (
                    <div
                      key={color}
                      className={`flag-filter-option ${filters.includes(`flag-${color}`) ? "selected" : ""}`}
                      onClick={() => handleToggleFlagFilter(color)}
                    >
                      <span className={`flag-button ${color}`}></span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleSetFilter("kommenterade")}
                className={filters.includes("kommenterade") ? "active-filter" : ""}
              >
                Kommenterade
              </button>
              <button className="rensa-filter-btn" onClick={clearFilters}>
                Rensa filter
              </button>
              <button className="add-btn" title="Lägg till rad (CTRL + Q)" onClick={addRow}>
                + Lägg till rad
              </button>
              <button className="complete-project-btn" title="Färdigställ projekt" onClick={markProjectAsDone}>
                ✔ Projekt klart
              </button>
            </div>
          </div>
          <div className="table-container">
            <table className="project-table">
              <thead>
                <tr>
                  <th className="flag-column"></th>
                  <th>Märkning</th>
                  <th>
                    Provtaget <br /> datum
                  </th>
                  <th>Inkommet</th>
                  <th>
                    Antal
                    <br />
                    vialer
                  </th>
                  <th>Plockat</th>
                  <th>Andel plockat</th>
                  <th>Artat</th>
                  <th>Artat datum</th>
                  <th>Antal djur</th>
                  <th>
                    Prover <br /> hemtagna
                  </th>
                  <th>
                    Prover <br /> åter
                  </th>
                  <th>Kommentarer</th>
                  <th>Fel</th>
                  <th className="delete-row-icon-th"></th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => (
                  <tr key={index} className="row-wrapper">
                    <td className="flag-container">
                      <button className={`flag-button ${row.flag}`} onClick={() => toggleFlag(index)}></button>
                    </td>
                    <td>
                      <input
                        style={{ height: "25px" }}
                        type="text"
                        value={row.märkning}
                        onChange={(e) => handleChange(index, "märkning", e.target.value)}
                      />
                    </td>
                    <td className="date-picker-cell">
                      <DatePicker
                        selected={row.datum ? parseISO(row.datum) : null}
                        onChange={(date) =>
                          handleChange(index, "datum", date ? date.toLocaleDateString("sv-SE") : "")
                        }
                        dateFormat="yyyy-MM-dd"
                        customInput={<CalendarInput />}
                        placeholderText="Välj datum"
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
                              onClick={() => handleChange(index, "datum", "")}
                            >
                              Nollställ datum
                            </div>
                            <div className="month-navigation">
                              <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                {"<"}
                              </button>
                              <span>
                                {monthDate.toLocaleString("sv-SE", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                {">"}
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </td>
                    <td className="date-picker-cell">
                      <DatePicker
                        selected={row.inkommet ? parseISO(row.inkommet) : null}
                        onChange={(date) =>
                          handleChange(index, "inkommet", date ? date.toLocaleDateString("sv-SE") : "")
                        }
                        dateFormat="yyyy-MM-dd"
                        customInput={<CalendarInput />}
                        placeholderText="Välj datum"
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
                              onClick={() => handleChange(index, "inkommet", "")}
                            >
                              Inget datum
                            </div>
                            <div className="month-navigation">
                              <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                {"<"}
                              </button>
                              <span>
                                {monthDate.toLocaleString("sv-SE", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                {">"}
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </td>
                    <td>
                      <input
                        style={{
                          height: "25px",
                          width: "34px",
                          color: row.antalvialer ? "#333" : "#888888", // Svart för ifyllt värde, ljusgrå om tomt
                          backgroundColor: "white",
                        }}
                        type="number"
                        value={row.antalvialer}
                        onChange={(e) => handleChange(index, "antalvialer", e.target.value)}
                      />
                    </td>
                    <td className="date-picker-cell">
                      <DatePicker
                        selected={row.plockat ? parseISO(row.plockat) : null}
                        onChange={(date) =>
                          handleChange(index, "plockat", date ? date.toLocaleDateString("sv-SE") : "")
                        }
                        dateFormat="yyyy-MM-dd"
                        customInput={<CalendarInput />}
                        placeholderText="Välj datum"
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
                              onClick={() => handleChange(index, "plockat", "")}
                            >
                              Inget datum
                            </div>
                            <div className="month-navigation">
                              <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                {"<"}
                              </button>
                              <span>
                                {monthDate.toLocaleString("sv-SE", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                {">"}
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </td>
                    <td>
                      <input
                        style={{ height: "25px" }}
                        type="text"
                        value={row.andelPlockat}
                        onChange={(e) => handleChange(index, "andelPlockat", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        style={{ height: "25px" }}
                        type="text"
                        value={row.artat}
                        onChange={(e) => handleChange(index, "artat", e.target.value)}
                      />
                    </td>
                    <td className="date-picker-cell">
                      <DatePicker
                        selected={row.artatdatum ? parseISO(row.artatdatum) : null}
                        onChange={(date) =>
                          handleChange(index, "artatdatum", date ? date.toLocaleDateString("sv-SE") : "")
                        }
                        dateFormat="yyyy-MM-dd"
                        customInput={<CalendarInput />}
                        placeholderText="Välj datum"
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
                              onClick={() => handleChange(index, "artatdatum", "")}
                            >
                              Inget datum
                            </div>
                            <div className="month-navigation">
                              <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                {"<"}
                              </button>
                              <span>
                                {monthDate.toLocaleString("sv-SE", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                {">"}
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </td>
                    <td>
                      <div className="antal-djur-inputs">
                        <input
                          style={{ height: "25px" }}
                          type="text"
                          placeholder="123"
                          value={row.antalDjur?.split("/")[0] || ""}
                          onChange={(e) => {
                            const andra = row.antalDjur?.split("/")[1] || "";
                            handleChange(index, "antalDjur", `${e.target.value}/${andra}`);
                          }}
                        />
                        <span>/</span>
                        <input
                          style={{ height: "25px" }}
                          type="text"
                          placeholder="456"
                          value={row.antalDjur?.split("/")[1] || ""}
                          onChange={(e) => {
                            const första = row.antalDjur?.split("/")[0] || "";
                            handleChange(index, "antalDjur", `${första}/${e.target.value}`);
                          }}
                        />
                      </div>
                    </td>
                    <td className="date-picker-cell">
                      <DatePicker
                        selected={row.hemtagna ? parseISO(row.hemtagna) : null}
                        onChange={(date) =>
                          handleChange(index, "hemtagna", date ? date.toLocaleDateString("sv-SE") : "")
                        }
                        dateFormat="yyyy-MM-dd"
                        customInput={<CalendarInput />}
                        placeholderText="Välj datum"
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
                              onClick={() => handleChange(index, "hemtagna", "")}
                            >
                              Inget datum
                            </div>
                            <div className="month-navigation">
                              <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                {"<"}
                              </button>
                              <span>
                                {monthDate.toLocaleString("sv-SE", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                {">"}
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </td>
                    <td className="date-picker-cell">
                      <DatePicker
                        selected={row.åter ? parseISO(row.åter) : null}
                        onChange={(date) =>
                          handleChange(index, "åter", date ? date.toLocaleDateString("sv-SE") : "")
                        }
                        dateFormat="yyyy-MM-dd"
                        customInput={<CalendarInput />}
                        placeholderText="Välj datum"
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
                              onClick={() => handleChange(index, "åter", "")}
                            >
                              Inget datum
                            </div>
                            <div className="month-navigation">
                              <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                {"<"}
                              </button>
                              <span>
                                {monthDate.toLocaleString("sv-SE", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                {">"}
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </td>
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
                        placeholder="Skriv kommentar..."
                      />
                    </td>
                    <td>
                      <select
                        value={row.fel || ""}
                        onChange={(e) => handleChange(index, "fel", e.target.value || null)}
                        style={{
                          height: "25px",
                          width: "100%",
                          padding: "0.2rem 0",
                          border: "none",
                          boxShadow: "0 0 0 1px #ccc",
                          borderRadius: "4px",
                          backgroundColor: "white",
                          fontSize: "0.75rem",
                          color: !row.fel ? "#888888" : "#333",
                        }}
                      >
                        <option value="">
                          Välj fel...
                        </option>
                        {felAlternativ.map((alternativ) => (
                          <option key={alternativ} value={alternativ}>
                            {alternativ}
                          </option>
                        ))}
                        {row.fel && !felAlternativ.includes(row.fel) && (
                          <option value={row.fel}>
                            {row.fel}
                          </option>
                        )}
                      </select>
                    </td>
                    <td className="delete-row-icon-td">
                      <button
                        onClick={() => {
                          setPendingDeleteIndex(index);
                          setShowDeleteModal(true);
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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