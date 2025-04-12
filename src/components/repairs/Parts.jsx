import React, { useState } from 'react';
import './repairs.css';

const predefinedRepairs = [
  "94", "98", "157", "96", "120", "95", "6479", "93", "115", "121", "2035", "2036", "2037", "2038",
  "1471", "1491", "1505", "12079", "197", "9655", "Shop Supplies", "Labor"
];

const PartSelector = ({ selectedParts, setSelectedParts }) => {
  const [customPart, setCustomPart] = useState('');

  const handleAddOrUpdatePart = (part) => {
    setSelectedParts(prev => {
      const existing = prev.find(p => p.name === part);
      if (existing) {
        return prev.map(p => p.name === part ? { ...p, quantity: p.quantity + 1 } : p);
      } else {
        return [...prev, { name: part, quantity: 1 }];
      }
    });
  };

  const handleRemovePart = (part) => {
    setSelectedParts(prev =>
      prev
        .map(p => p.name === part ? { ...p, quantity: p.quantity - 1 } : p)
        .filter(p => p.quantity > 0)
    );
  };

  const addCustomPart = () => {
    const trimmed = customPart.trim();
    if (trimmed && !selectedParts.some(p => p.name === trimmed)) {
      setSelectedParts(prev => [...prev, { name: trimmed, quantity: 1 }]);
      setCustomPart('');
    }
  };

  const getQuantity = (part) => {
    const found = selectedParts.find(p => p.name === part);
    return found ? found.quantity : 0;
  };

  return (
    <div className="repair-selector">
      <label>Parts Needed</label>
      <table className="parts-table">
        <thead>
          <tr>
            <th>Part</th>
            <th>Quantity</th>
            <th>Controls</th>
          </tr>
        </thead>
        <tbody>
          {predefinedRepairs.map((item) => (
            <tr key={item}>
              <td>{item}</td>
              <td>{getQuantity(item)}</td>
              <td>
                <button type="button" onClick={() => handleAddOrUpdatePart(item)}>+</button>
                <button type="button" onClick={() => handleRemovePart(item)} disabled={getQuantity(item) === 0}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="custom-repair">
        <input
          type="text"
          value={customPart}
          onChange={(e) => setCustomPart(e.target.value)}
          className="input-field"
          placeholder="Add custom part"
        />
        <button type="button" className="btn-add" onClick={addCustomPart}>
          Add Custom Part
        </button>
      </div>

      {/* Display custom parts below the table */}
      {selectedParts.filter(p => !predefinedRepairs.includes(p.name)).length > 0 && (
        <div className="custom-parts-list">
          <h5>Custom Parts</h5>
          <ul>
            {selectedParts
              .filter(p => !predefinedRepairs.includes(p.name))
              .map(p => (
                <li key={p.name}>
                  {p.name} — Qty: {p.quantity}
                  <button onClick={() => handleAddOrUpdatePart(p.name)}>+</button>
                  <button onClick={() => handleRemovePart(p.name)}>-</button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PartSelector;
