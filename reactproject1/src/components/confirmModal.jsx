// src/components/ConfirmModal.jsx
import React from "react";
import "./confirmModal.css";

export default function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Ja</button>
          <button onClick={onCancel}>Nej</button>
        </div>
      </div>
    </div>
  );
}
