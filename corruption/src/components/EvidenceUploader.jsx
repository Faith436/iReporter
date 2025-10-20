import React, { useState } from "react";

const EvidenceUploader = ({ onUpload }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    if (onUpload) onUpload(selectedFiles);
  };

  return (
    <div className="card">
      <h3>📎 Upload Evidence</h3>
      <input
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        onChange={handleFileChange}
        style={{ marginTop: "10px" }}
      />
      <div className="file-list">
        {files.map((file, index) => (
          <p key={index}>📄 {file.name}</p>
        ))}
      </div>
    </div>
  );
};

export default EvidenceUploader;
