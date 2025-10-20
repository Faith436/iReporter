// import React, { useState } from 'react';
// import '../App.css';

// function CreateReport() {
//   const [type, setType] = useState('red-flag');
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Report Created!\nType: ${type}\nTitle: ${title}\nDescription: ${description}`);
//   };

//   return (
//     <div className="form-container">
//       <h2>🚨 Create New Report</h2>
//       <form onSubmit={handleSubmit}>
//         <select value={type} onChange={e => setType(e.target.value)} required>
//           <option value="red-flag">🔴 Red Flag Report</option>
//           <option value="intervention">🛠️ Intervention Request</option>
//         </select>
//         <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
//         <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
//         <button type="submit">Submit Report</button>
//       </form>
//     </div>
//   );
// }

// export default CreateReport;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateReport.css";

const CreateReport = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportData = { title, description, location, images, videos };
    console.log("Submitted report:", reportData);
    alert("Report submitted!");
    navigate("/dashboard"); // redirect to dashboard
  };

  const handleImageUpload = (e) => setImages([...e.target.files]);
  const handleVideoUpload = (e) => setVideos([...e.target.files]);

  return (
    <div className="create-report-card">
      <h2>🔴 Report Red Flag</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          placeholder="Bribery at Licensing Office"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Official demanded $500 for quick processing..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
        />

        <label>📍 Location</label>
        <div className="location-box">
          <p>Latitude: {location.lat || "—"}</p>
          <p>Longitude: {location.lng || "—"}</p>
          <button
            type="button"
            onClick={() =>
              setLocation({ lat: "40.7128", lng: "-74.0060" })
            }
          >
            🗺️ Select on Map
          </button>
        </div>

        <label>🖼️ Add Evidence</label>
        <div className="evidence-upload">
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          <input type="file" multiple accept="video/*" onChange={handleVideoUpload} />
          <p>{images.length} images • {videos.length} videos</p>
        </div>

        <button type="submit" className="submit-btn">
          SUBMIT REPORT
        </button>
      </form>
    </div>
  );
};

export default CreateReport;

