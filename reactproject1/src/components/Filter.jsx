import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import './Filter.css';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div
        onClick={onClick}
        onMouseDown={(e) => e.preventDefault()} // Prevent text selection on click
        ref={ref}
        tabIndex={0}
        className="calendar-input"
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            backgroundColor: 'white',
            boxShadow: '0 0 0 1px #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            boxSizing: 'border-box',
            padding: '0.5rem',
            fontSize: '12px',
            color: '#333',
            outline: 'none',
        }}
    >
        <span
            style={{
                color: value ? '#333' : '#888',
            }}
        >
            {value || placeholder}
        </span>
        <Calendar size={16} />
    </div>
));

CalendarInput.displayName = 'CalendarInput';

const Filter = ({ isOpen, onClose, onFilter }) => {
    const [deadline, setDeadline] = useState(null);

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
                    Prioritet:
                    <select>
                        <option value="">Alla</option>
                        <option value="hög">Hög</option>
                        <option value="mellan">Mellan</option>
                        <option value="låg">Låg</option>
                    </select>
                </label>
                <label>
                    Deadline (datum):
                    <DatePicker
                        selected={deadline}
                        onChange={(date) => setDeadline(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Välj datum"
                        customInput={<CalendarInput placeholder="Välj datum" />}
                        isClearable
                    />
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
