import React from 'react';

const RecentReports = () => {
  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  
  // Get ALL reports from localStorage and filter by current user
  const allReports = JSON.parse(localStorage.getItem("myReports")) || [];
  const userReports = allReports.filter(report => report.userId === currentUser?.id);
  
  // Show only recent reports (last 5) - newest first
  const recentReports = userReports
    .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
    .slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'under-investigation': return '#d69e2e';
      case 'resolved': return '#38a169';
      default: return '#718096';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'red-flag' ? '🚩' : '🛠️';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
      
      {recentReports.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No reports yet. Create your first report to see it here.</p>
        </div>
      ) : (
        recentReports.map(report => (
          <div key={report.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition duration-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(report.reportType)}</span>
                <h4 className="font-semibold text-gray-900">{report.title}</h4>
              </div>
              <span 
                className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                style={{backgroundColor: getStatusColor(report.status)}}
              >
                {report.status ? report.status.replace('-', ' ') : 'Pending'}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{report.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>{report.location || 'Location not specified'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>{report.date || 'Date not specified'}</span>
              </div>
              {report.coordinates && (
                <div className="flex items-center gap-1">
                  <span>🌐</span>
                  <span>{report.coordinates.lat?.toFixed(4)}, {report.coordinates.lng?.toFixed(4)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>📋</span>
                <span className="capitalize">{report.reportType?.replace('-', ' ') || 'Unknown type'}</span>
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition">
                View Details
              </button>
              {report.status === "pending" && (
                <button className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition">
                  Edit
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentReports;