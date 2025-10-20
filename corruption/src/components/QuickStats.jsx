
const QuickStarts = () => {
  const stats = [
    { title: "Total Reports", value: 124 },
    { title: "Under Investigation", value: 42 },
    { title: "Resolved Cases", value: 61 },
  ];

  return stats.map((item, i) => (
    <div className="stat-card" key={i}>
      <div className="stat-title">{item.title}</div>
      <div className="stat-value">{item.value}</div>
    </div>
  ));
};

export default QuickStarts;

