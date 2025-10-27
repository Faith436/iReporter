import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('Resolved');
  const [reason, setReason] = useState(
    'Repairs completed by DPW on November 20, 2023. Quality check passed.'
  );
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(true);

  const handleUpdate = () => {
    alert(
      `Status Updated to ${status}\nReason: ${reason}\nEmail Notification: ${notifyEmail}\nSMS Notification: ${notifySMS}`
    );
    navigate('/admin');
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">Update Report Status</h2>
      <p className="text-gray-700">Report: "Road Repair Needed"</p>
      <p className="text-gray-600">Current Status: <span className="font-semibold text-red-500">🔴 Pending</span></p>

      {/* Status Selection */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Select New Status:</h3>
        <div className="flex flex-col gap-2">
          {[
            { value: 'Pending', label: '🔴 Pending', color: 'text-red-500' },
            { value: 'Under Investigation', label: '🟡 Under Investigation', color: 'text-yellow-500' },
            { value: 'Rejected', label: '🔵 Rejected', color: 'text-blue-500' },
            { value: 'Resolved', label: '🟢 Resolved', color: 'text-green-500' },
          ].map((s) => (
            <label key={s.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={s.value}
                checked={status === s.value}
                onChange={(e) => setStatus(e.target.value)}
                className="accent-blue-600"
              />
              <span className={`${s.color} font-medium`}>{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Reason (Optional):</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          rows={4}
          placeholder="Provide details for status update..."
        />
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Notify User:</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifyEmail}
            onChange={() => setNotifyEmail(!notifyEmail)}
            className="accent-blue-600"
          />
          Email Notification
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifySMS}
            onChange={() => setNotifySMS(!notifySMS)}
            className="accent-blue-600"
          />
          SMS Notification
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Update Status
        </button>
      </div>
    </div>
  );
}

export default UpdateStatus;
