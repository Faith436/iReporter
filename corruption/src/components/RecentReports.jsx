
const RecentReports = () => {
  const reports = [
    { title: "Bribery at Customs", status: "Under Investigation" },
    { title: "Illegal Land Allocation", status: "Resolved" },
    { title: "Procurement Fraud", status: "Pending Review" },
  ];

  return (
    <div className="reports-list">
      {reports.map((report, index) => (
        <div key={index} className="report-card">
          <div className="report-title">{report.title}</div>
          <div className="report-status">{report.status}</div>
        </div>
      ))}
    </div>
  );
};

export default RecentReports;

