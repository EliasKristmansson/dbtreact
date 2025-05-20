// src/components/SampleTable.jsx
import React, { useState } from 'react';

export default function SampleTable() {
  const [rows, setRows] = useState([
    {
      märkning: '',
      provtagetdatum: '',
      inkommet: '',
      antalvialer: '',
      plockat: '',
      andelPlockat: '',
      datum: '',
      antalDjur: '',
      hemtagna: '',
      åter: '',
      kommentarer: ''
    }
  ]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, {
      märkning: '',
      provtagetdatum: '',
      inkommet: '',
      antalvialer: '',
      plockat: '',
      andelPlockat: '',
      datum: '',
      antalDjur: '',
      hemtagna: '',
      åter: '',
      kommentarer: ''
    }]);
  };

  return (
    <div>
      <h2>🧪 Provtagningsdokumentation</h2>
      <table border="1" cellPadding="6" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Märkning</th>
            <th>Provtaget datum</th>
            <th>Inkommet</th>
            <th>antalvialer</th>
            <th>Plockat</th>
            <th>Andel Plockat</th>
            <th>Antal djur</th>
            <th>Prover hemtagna</th>
            <th>Prover åter</th>
            <th>Övriga Kommentarer</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {Object.entries(row).map(([key, value]) => (
                <td key={key}>
                  <input
                    type="text"
                    value={value}
                    onChange={e => handleChange(index, key, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} style={{ marginTop: '1rem' }}>➕ Lägg till rad</button>
    </div>
  );
}
