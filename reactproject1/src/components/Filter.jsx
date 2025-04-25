import React from 'react';
import './Filter.css';

const Filter = ({ isOpen, onClose, onFilter }) => {
  if (!isOpen) return null;

  return (
    <div className="filter-overlay" onClick={onClose}>
      <div className="filter-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Filtrera</h2>
        <label>
          Kund:
          <input type="text" placeholder="Skriv kundnamn..." />
        </label>
        <label>
          Projektnamn:
          <input type="text" placeholder="Skriv projektnamn..." />
        </label>
        <label>
          Märkning:
          <input type="text" placeholder="Skriv märkning..." />
        </label>
        <label>
          Prioritet:
          <select>
            <option value="">Alla</option>
            <option value="hög">Hög</option>
            <option value="mellan">Mellan</option>
            <option value="låg">Låg</option>
          </select>
        </label>
        <label>
          Inkommet (datum):
          <input type="date" />
        </label>
        <label>
          Kommentar:
          <input type="text" placeholder="Sök kommentar..." />
        </label>

        <div className="filter-actions">
          <button onClick={onFilter}>Filtrera</button>
          <button onClick={onClose} className="cancel">Avbryt</button>
        </div>
      </div>
    </div>
  );
};

export default Filter;