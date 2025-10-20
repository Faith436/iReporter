import React, { useState } from 'react';
import '../App.css';

function CreateReport() {
  const [type, setType] = useState('red-flag');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Report Created!\nType: ${type}\nTitle: ${title}\nDescription: ${description}`);
  };

  return (
    <div className="form-container">
      <h2>🚨 Create New Report</h2>
      <form onSubmit={handleSubmit}>
        <select value={type} onChange={e => setType(e.target.value)} required>
          <option value="red-flag">🔴 Red Flag Report</option>
          <option value="intervention">🛠️ Intervention Request</option>
        </select>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
}

export default CreateReport;
