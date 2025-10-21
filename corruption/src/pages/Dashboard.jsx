import React from 'react';
import Side from '../components/Side';
import QuickStarts from '../components/QuickStats';
import RecentReports from '../components/RecentReports';
import Footer from '../components/Footer';
import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <Side />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h2>👋 Welcome back, User!</h2>
          <p>Here’s what’s happening with your reports today.</p>
        </header>

        {/* QuickStarts Section */}
        <section className="quick-starts">
          <QuickStarts />
        </section>

        {/* Recent Reports Section */}
        <section className="dashboard-section">
          <h3>Recently Reported Corruption Cases</h3>
          <RecentReports />
        </section>

        {/* Footer always at bottom */}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
