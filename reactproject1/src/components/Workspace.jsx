import React, { useState } from "react";
import "./Workspace.css";
import ConfirmModal from "./confirmModal";

export default function Workspace({ tabs, onNewProjectClick }) {
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
			flag: ""
		}
	]);

  const confirmDelete = () => {
    setRows(rows.filter((_, index) => index !== pendingDeleteIndex));
    setPendingDeleteIndex(null);
    setShowDeleteModal(false);
  };
  
  const cancelDelete = () => {
    setPendingDeleteIndex(null);
    setShowDeleteModal(false);
  };
  


	const [filter, setFilter] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [pendingCommentIndex, setPendingCommentIndex] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);


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
				flag: ""
			}
		]);
	};

	const removeRow = (indexToRemove) => {
		setRows(rows.filter((_, index) => index !== indexToRemove));
	};

	const filteredRows = rows.filter(row => {
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
  

	const showEmpty = tabs.length === 0;

	return (
		<div className="workspace">
			{showEmpty ? (
				<div className="new-project">
					<button className="new-project-btn" onClick={onNewProjectClick}>+ Nytt projekt</button>
				</div>
			) : (
				<>
					<div className="workspace-header">
						<div className="filter-buttons">
							<button onClick={() => setFilter("intePlockade")}>Inte plockade</button>
							<button onClick={() => setFilter("flaggade")}>Flaggade</button>
							<button onClick={() => setFilter("kommenterade")}>Kommenterade</button>
							<button className="rensa-filter-btn"onClick={() => setFilter("")}>Rensa filter</button>
							<button className="add-btn" onClick={addRow}>+ Lägg till rad</button>
						</div>
					</div>

					<div className="table-container">
						<table className="project-table">
							<thead>
								<tr>
									<th>Flagga</th>
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
										<td>
                    <button onClick={() => {setPendingDeleteIndex(index);setShowDeleteModal(true);}}> 🗑️</button>



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

