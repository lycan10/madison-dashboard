import React, { useState } from 'react';
import './repairs.css';

const predefinedRepairs = [
  "3 Series", "4 Series", "6 Series", "8 Series", "1/8 Parking Brake Cable", "3/16 Parking Brake Cable", "Parking Brake Lever"
];

const CableSelector = ({ selectedCable = [], setSelectedCable }) => {
  const [customCable, setCustomCable] = useState('');

  const toggleCable = (item) => {
    setSelectedCable((prev = []) =>
      prev.includes(item)
        ? prev.filter(r => r !== item)
        : [...prev, item]
    );
  };

  const addCustomToggle = () => {
    const trimmed = customCable.trim();
    if (trimmed !== '' && !selectedCable.includes(trimmed)) {
      setSelectedCable(prev => [...(prev || []), trimmed]);
      setCustomCable('');
    }
  };

  return (
    <div className="repair-selector">
      <label>Job Description</label>
      <div className="repair-options">
        {predefinedRepairs.map((item) => (
          <div
            key={item}
            className={`repair-box ${(selectedCable || []).includes(item) ? 'selected' : ''}`}
            onClick={() => toggleCable(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="custom-repair">
        <input
          type="text"
          value={customCable}
          onChange={(e) => setCustomCable(e.target.value)}
          className="input-field"
          placeholder="Custom repair"
        />
        <button type="button" className="btn-add" onClick={addCustomToggle}>
          Add More
        </button>
      </div>
    </div>
  );
};

export default CableSelector;
