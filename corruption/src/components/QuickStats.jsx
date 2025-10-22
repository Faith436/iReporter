// import React from 'react';
// import { useReports } from '../context/ReportContext';

// const QuickStats = () => {
//   const { getStats } = useReports();
//   const stats = getStats();

//   console.log('QuickStats rendering with:', stats);

//   const statCards = [
//     { 
//       title: "Red Flags", 
//       value: stats.redFlags, 
//       color: "red",
//       description: "Corruption reports"
//     },
//     { 
//       title: "Interventions", 
//       value: stats.interventions, 
//       color: "blue",
//       description: "Infrastructure requests"
//     },
//     { 
//       title: "Under Investigation", 
//       value: stats.underInvestigation, 
//       color: "yellow",
//       description: "Active investigations"
//     },
//     { 
//       title: "Resolved", 
//       value: stats.resolved, 
//       color: "green",
//       description: "Completed cases"
//     }
//   ];

//   return (
//     <div className="quick-stats-grid">
//       {statCards.map((stat, index) => (
//         <div key={index} className={`stat-card stat-${stat.color}`}>
//           <div className="stat-number">{stat.value}</div>
//           <div className="stat-title">{stat.title}</div>
//           <div className="stat-description">{stat.description}</div>
//         </div>
//       ))}
//       <div className="stat-card create-report-card">
//         <a href="/create-report" className="create-report-btn">
//           + Create Report
//         </a>
//       </div>
//     </div>
//   );
// };

// export default QuickStats;

import React from 'react';

const QuickStats = () => {
  // Get reports from localStorage for real data
  const reports = JSON.parse(localStorage.getItem('myReports')) || [];
  
  const stats = {
    redFlags: reports.filter(r => r.reportType === 'red-flag').length,
    interventions: reports.filter(r => r.reportType === 'intervention').length,
    underInvestigation: reports.filter(r => r.status === 'under-investigation').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  const statCards = [
    { 
      title: "Red Flags", 
      value: stats.redFlags, 
      color: "red",
      description: "Corruption reports"
    },
    { 
      title: "Interventions", 
      value: stats.interventions, 
      color: "blue",
      description: "Infrastructure requests"
    },
    { 
      title: "Under Investigation", 
      value: stats.underInvestigation, 
      color: "yellow",
      description: "Active investigations"
    },
    { 
      title: "Resolved", 
      value: stats.resolved, 
      color: "green",
      description: "Completed cases"
    }
  ];

  return (
    <div className="quick-stats-grid">
      {statCards.map((stat, index) => (
        <div key={index} className={`stat-card stat-${stat.color}`}>
          <div className="stat-number">{stat.value}</div>
          <div className="stat-title">{stat.title}</div>
          <div className="stat-description">{stat.description}</div>
        </div>
      ))}
      <div className="stat-card create-report-card">
        <a href="/create-report" className="create-report-btn">
          + Create Report
        </a>
      </div>
    </div>
  );
};

export default QuickStats;