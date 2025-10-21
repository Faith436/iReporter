// import React from 'react';
// import Side from '../components/Side';
// import QuickStarts from '../components/QuickStats';
// import RecentReports from '../components/RecentReports';
// import Footer from '../components/Footer';
// import '../styles/Dashboard.css';

// function Dashboard() {
//   return (
//     <div className="dashboard">
//       <Side />

//       <div className="dashboard-main">
//         <header className="dashboard-header">
//           <h2>👋 Welcome back, User!</h2>
//           <p>Here’s what’s happening with your reports today.</p>
//         </header>

//         {/* QuickStarts Section */}
//         <section className="quick-starts">
//           <QuickStarts />
//         </section>

//         {/* Recent Reports Section */}
//         <section className="dashboard-section">
//           <h3>Recently Reported Corruption Cases</h3>
//           <RecentReports />
//         </section>

//         {/* Footer always at bottom */}
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default Dashboard;


import React, { useState } from 'react';
import Side from '../components/Side';
import Footer from '../components/Footer';
import '../styles/Dashboard.css';

// Temporary components - we'll replace these with your upgraded ones
const QuickStats = () => {
  const stats = [
    { title: "Red Flags", value: 2, color: "red" },
    { title: "Interventions", value: 2, color: "blue" },
    { title: "Under Investigation", value: 2, color: "yellow" },
    { title: "Resolved", value: 1, color: "green" }
  ];

  return (
    <div className="quick-stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card stat-${stat.color}`}>
          <div className="stat-number">{stat.value}</div>
          <div className="stat-title">{stat.title}</div>
        </div>
      ))}
      <div className="stat-card create-report-card">
        <button className="create-report-btn">
          + Create Report
        </button>
      </div>
    </div>
  );
};

const ReportList = () => {
  const reports = [
    {
      id: 1,
      title: "Corruption in Road Construction Contract",
      type: "red-flag",
      status: "under-investigation",
      description: "Witnessed irregularities in the bidding process for the new highway construction. Documents show inflated costs and questionable contractor selection.",
      location: "Victoria Island, Lagos, Nigeria",
      images: 1,
      date: "2025-10-20"
    }
  ];

  return (
    <div className="reports-list">
      {reports.map(report => (
        <div key={report.id} className="report-card">
          <div className="report-header">
            <h3 className="report-title">{report.title}</h3>
            <div className="report-status">
              <span className="status-badge under-investigation">
                Under Investigation
              </span>
              <span className="type-badge red-flag">
                Red Flag
              </span>
            </div>
          </div>
          
          <p className="report-description">{report.description}</p>
          
          <div className="report-footer">
            <div className="report-location">
              <span className="location-pin">📍</span>
              {report.location}
            </div>
            <div className="report-meta">
              {report.images > 0 && (
                <span className="image-count">{report.images} image</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function Dashboard() {
  const [activeView, setActiveView] = useState('list');
  const [reportType, setReportType] = useState('all');
  const [status, setStatus] = useState('all');

  return (
    <div className="dashboard">
      <Side />
      
      <div className="dashboard-main">
        {/* Header Section */}
        <header className="dashboard-header">
          <h1>Incident Reports Dashboard</h1>
          <p>Report corruption incidents and request government interventions</p>
        </header>

        {/* Quick Stats Section */}
        <section className="quick-starts">
          <QuickStats />
        </section>

        {/* Controls Section */}
        <div className="dashboard-controls">
          <div className="view-controls">
            <div className="view-toggles">
              <button 
                className={`view-toggle ${activeView === 'list' ? 'active' : ''}`}
                onClick={() => setActiveView('list')}
              >
                List View
              </button>
              <button 
                className={`view-toggle ${activeView === 'map' ? 'active' : ''}`}
                onClick={() => setActiveView('map')}
              >
                Map View
              </button>
            </div>
            
            <div className="filter-controls">
              <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="red-flag">Red Flag</option>
                <option value="intervention">Intervention</option>
              </select>

              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="under-investigation">Under Investigation</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List Section */}
        <section className="dashboard-section">
          <ReportList />
        </section>

        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
