// src/data/reportsData.js

export const dummyReports = [
  {
    id: 1,
    title: "Water Leak in Block A",
    description: "Leak in main pipe",
    status: "pending",
    location: "Block A",
    date: "2025-10-20",
    evidence: "photo1.jpg",
    history: [
      { status: "Pending", note: "System: Auto", date: "Nov 15, 9:14 AM" },
      { status: "Under Investigation", note: "Admin: Assigned to Maintenance", date: "Today, 10:30 AM" },
    ],
  },
  {
    id: 2,
    title: "Broken Window",
    description: "Storm damage",
    status: "resolved",
    location: "Block B",
    date: "2025-10-18",
    evidence: "photo2.jpg",
    history: [{ status: "Resolved", note: "Fixed by Maintenance", date: "Oct 19, 11:00 AM" }],
  },
  {
    id: 3,
    title: "Power Outage",
    description: "West wing electricity failure",
    status: "rejected",
    location: "West Wing",
    date: "2025-10-22",
    evidence: "photo3.jpg",
    history: [{ status: "Rejected", note: "Technicians assigned", date: "Oct 22, 3:00 PM" }],
  },
  {
    id: 4,
    title: "Unauthorized Access",
    description: "Server room breach",
    status: "pending",
    location: "Server Room",
    date: "2025-10-23",
    reportType: "Red-Flag",
    evidence: "photo4.jpg",
    history: [
      { status: "Pending", note: "Security alerted", date: "Oct 23, 8:00 AM" },
      { status: "Under Investigation", note: "Admin assigned to review CCTV", date: "Today, 9:00 AM" },
    ],
  },
];

export const statuses = ["all", "resolved", "pending", "rejected", "under investigation"];
export const dateOptions = ["All Dates", "Today", "Last 3 Days", "This Week", "This Month", "Last Month"];
