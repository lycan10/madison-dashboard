import React, { useState } from 'react';
import './repairs.css';

const predefinedRepairs = [
  "1/4 Inch Hose", "3/8 Inch Hose", "1/2 Inch Hose", "5/8 Inch Hose", "3/4 Inch Hose", "1 Inch Hose",
];

const HoseSelector = ({ selectedHose = [], setSelectedHose }) => {
  const [customHose, setCustomHose] = useState('');

  const toggleHose = (item) => {
    setSelectedHose((prev = []) =>
      prev.includes(item)
        ? prev.filter(r => r !== item)
        : [...prev, item]
    );
  };

  const addCustomToggle = () => {
    const trimmed = customHose.trim();
    if (trimmed !== '' && !selectedHose.includes(trimmed)) {
      setSelectedHose(prev => [...(prev || []), trimmed]);
      setCustomHose('');
    }
  };

  return (
    <div className="repair-selector">
      <label>Job Description</label>
      <div className="repair-options">
        {predefinedRepairs.map((item) => (
          <div
            key={item}
            className={`repair-box ${(selectedHose || []).includes(item) ? 'selected' : ''}`}
            onClick={() => toggleHose(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="custom-repair">
        <input
          type="text"
          value={customHose}
          onChange={(e) => setCustomHose(e.target.value)}
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

export default HoseSelector;
