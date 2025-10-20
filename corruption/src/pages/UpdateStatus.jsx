import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
function UpdateStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Resolved');
  const [reason, setReason] = useState('Repairs completed by DPW on November 20, 2023. Quality check passed.');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(true);

  const handleUpdate = () => {
    alert(`Status Updated to ${status}\nReason: ${reason}\nEmail Notification: ${notifyEmail}\nSMS Notification: ${notifySMS}`);
    navigate('/admin');
  };

  return (
    <div className="update-status-container">
      <h2>Update Report Status</h2>
      <p>Report: "Road Repair Needed"</p>
      <p>Current Status: 🔴 Pending</p>

      <h3>Select New Status:</h3>
      <label><input type="radio" value="Pending" checked={status==='Pending'} onChange={e => setStatus(e.target.value)} /> 🔴 Pending</label>
      <label><input type="radio" value="Under Investigation" checked={status==='Under Investigation'} onChange={e => setStatus(e.target.value)} /> 🟡 Under Investigation</label>
      <label><input type="radio" value="Rejected" checked={status==='Rejected'} onChange={e => setStatus(e.target.value)} /> 🔵 Rejected</label>
      <label><input type="radio" value="Resolved" checked={status==='Resolved'} onChange={e => setStatus(e.target.value)} /> 🟢 Resolved</label>

      <h3>Reason (Optional):</h3>
      <textarea value={reason} onChange={e => setReason(e.target.value)} />

      <h3>Notify User:</h3>
      <label><input type="checkbox" checked={notifyEmail} onChange={() => setNotifyEmail(!notifyEmail)} /> Email Notification</label>
      <label><input type="checkbox" checked={notifySMS} onChange={() => setNotifySMS(!notifySMS)} /> SMS Notification</label>

      <button onClick={() => navigate(-1)}>CANCEL</button>
      <button onClick={handleUpdate}>UPDATE STATUS</button>
    </div>
  );
}

export default UpdateStatus;
