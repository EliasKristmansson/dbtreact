import React, { useState, useEffect, useRef } from "react";
import RenameModal from "./RenameModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";

export default function Project({
	name,
	deadline,
	onDoubleClick,
	onDelete,
	onRename,
	onDeadlineChange,
	className,
	projectId, // Lägg till projectId som prop
	activeTabId
}) {
	const [contextMenu, setContextMenu] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);
	const [showRenameModal, setShowRenameModal] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);
	const [datePickerPosition, setDatePickerPosition] = useState({ x: 0, y: 0 });
	const datePickerRef = useRef(null);

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

	const closeRenameModal = () => {
		setShowRenameModal(false);
	};

	const handleRenameConfirm = (oldName, newName) => {
		onRename(oldName, newName);
		setShowRenameModal(false);
	};

	const closeContextMenu = () => {
		setContextMenu(null);
	};

	const handleClickOutside = (e) => {
		if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
			setShowDatePicker(false);
		}
	};

	useEffect(() => {
		if (showDatePicker) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showDatePicker]);

	return (
		<div className={className} id="project-container">
			<li onDoubleClick={() => onDoubleClick(name)} onContextMenu={handleContextMenu}>
				<span>{name}</span>
				<span className="project-date">
					{selectedDate ? selectedDate.toLocaleDateString("sv-SE") : "Ingen deadline"}
				</span>
			</li>

			{contextMenu && (
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
					<li style={{ padding: "6px 12px", cursor: "pointer" }} onClick={handleRename}>
						Byt namn
					</li>
					<li style={{ padding: "6px 12px", cursor: "pointer" }} onClick={handleChangeDeadline}>
						Byt deadline
					</li>
					<li style={{ padding: "6px 12px", cursor: "pointer" }} onClick={handleDelete}>
						Ta bort
					</li>
				</div>
			)}

			{contextMenu && <div className="overlay" onClick={closeContextMenu}></div>}

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
					}}
				>
					<DatePicker
						selected={selectedDate}
						onChange={(date) => {
							setSelectedDate(date);
							onDeadlineChange(projectId, date ? date.toLocaleDateString("sv-SE") : "");
							setShowDatePicker(false);
						}}
						inline
						dateFormat="yyyy-MM-dd"
					/>
				</div>
			)}
		</div>
	);
}