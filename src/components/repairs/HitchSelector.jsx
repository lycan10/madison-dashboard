import React, { useState } from 'react';
import './repairs.css';

const predefinedRepairs = [
  "Hitch", "Electrical", "Installation"
];

const HitchSelector = ({ selectedHitch, setSelectedHitch }) => {
  const [customHitch, setCustomHitch] = useState('');

  const toggleHitch = (item) => {
    setSelectedHitch(prev =>
      prev.includes(item)
        ? prev.filter(r => r !== item)
        : [...prev, item]
    );
  };

  const addCustomToggle = () => {
    if (customHitch.trim() !== '' && !selectedHitch.includes(customHitch.trim())) {
        setSelectedHitch(prev => [...prev, customHitch.trim()]);
        setCustomHitch('');
    }
  };

  return (
    <div className="repair-selector">
      <label>Job Description</label>
      <div className="repair-options">
        {predefinedRepairs.map((item) => (
          <div
            key={item}
            className={`repair-box ${selectedHitch.includes(item) ? 'selected' : ''}`}
            onClick={() => toggleHitch(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="custom-repair">
        <input
          type="text"
          value={customHitch}
          onChange={(e) => setCustomHitch(e.target.value)}
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

export default HitchSelector;
