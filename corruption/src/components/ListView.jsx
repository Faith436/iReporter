// import React from "react";
// import { Trash2, Pencil } from "lucide-react";

// const ListView = ({ reports, role, userEmail, loading, onEdit, onDelete }) => {
//   const visibleReports = role === "admin" ? reports : reports.filter(r => r.createdBy === userEmail);

//   return (
//     <div className="bg-white shadow rounded-lg">
//       <table className="min-w-full text-sm text-left">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-3">Title</th>
//             <th className="p-3">Description</th>
//             <th className="p-3">Location</th>
//             <th className="p-3">Date</th>
//             <th className="p-3">Status</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan={6} className="text-center p-4 text-gray-500">
//                 Loading reports...
//               </td>
//             </tr>
//           ) : visibleReports.length ? (
//             visibleReports.map(report => (
//               <tr key={report.id} className="border-b hover:bg-gray-50">
//                 <td className="p-3">{report.title}</td>
//                 <td className="p-3">{report.description}</td>
//                 <td className="p-3">{report.location}</td>
//                 <td className="p-3">{new Date(report.created_at).toLocaleDateString()}</td>
//                 <td className="p-3 capitalize">{report.status}</td>
//                 <td className="p-3 flex gap-2">
//                   {role === "admin" ? (
//                     <button
//                       onClick={() => onDelete(report.id)}
//                       className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs flex items-center gap-1"
//                     >
//                       <Trash2 className="w-4 h-4" /> Delete
//                     </button>
//                   ) : report.status === "pending" ? (
//                     <button
//                       onClick={() => onEdit(report)}
//                       className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1"
//                     >
//                       <Pencil className="w-4 h-4" /> Edit
//                     </button>
//                   ) : null}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={6} className="text-center p-4 text-gray-500">
//                 No reports found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ListView;

// src/components/ListView.jsx - Fully Dynamic Data Display

import React, { useState, useEffect } from "react";
import { Trash2, SquarePen } from "lucide-react"; 
import moment from 'moment';
import { useReports } from "../contexts/ReportContext"; 

/**
 * Helper component to render the colored Status Tag. (Unchanged)
 */
const StatusTag = ({ status }) => {
  let classes = "";
  const normalizedStatus = status ? status.toLowerCase() : 'pending';
  let displayStatus = status.charAt(0).toUpperCase() + status.slice(1); 

  switch (normalizedStatus) {
    case "resolved":
      classes = "bg-green-100 text-green-800";
      break;
    case "under investigation":
      classes = "bg-yellow-100 text-yellow-800";
      displayStatus = "Under Investigation"; 
      break;
    case "rejected":
      classes = "bg-red-100 text-red-800";
      break;
    case "pending": 
    default:
      classes = "bg-blue-100 text-blue-800";
      break;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${classes}`}>
      {displayStatus}
    </span>
  );
};

// --- ListView Component (Now handles fetching) ---
const ListView = ({ role, loggedInUserId, onEdit, onDelete, refreshKey }) => {
  
  const { 
    reports, 
    loading: contextLoading, 
    fetchUserReports, 
  } = useReports();
  
  const [internalLoading, setInternalLoading] = useState(false);
  
  // FETCHING LOGIC MOVED HERE (Unchanged)
  useEffect(() => {
    const loadReports = async () => {
      if (loggedInUserId) {
        setInternalLoading(true);
        await fetchUserReports(loggedInUserId, role);
        setInternalLoading(false);
      }
    };
    loadReports();
  }, [loggedInUserId, role, fetchUserReports, refreshKey]); 

  const tableHeaders = [
    { key: 'title', label: 'Title', className: 'w-2/5' },
    { key: 'location', label: 'Location', className: 'w-[12%]' }, 
    { key: 'type', label: 'Type', className: 'w-[8%]' }, 
    { key: 'status', label: 'Status', className: 'w-[15%]' }, 
    { key: 'date', label: 'Date', className: 'w-[12%]' },
    { key: 'actions', label: 'Actions', align: 'right', className: 'w-[5%]' }, 
  ];
  
  const handleInternalDelete = async (id) => {
      await onDelete(id); 
  };


  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Reports</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    header.align === 'right' ? 'text-right' : 'text-left'
                  } ${header.className || ''}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-100">
            {(internalLoading || contextLoading) ? (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center py-12 text-gray-500">
                  Loading reports...
                </td>
              </tr>
            ) : reports.length ? (
              reports.map(report => (
                <tr key={report.id} className="hover:bg-gray-50 transition duration-150">
                  
                  {/* Title */}
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 max-w-sm">
                    {report.title}
                  </td>
                  
                  {/* Location - Reads directly from the report object */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.location || "N/A"} 
                  </td>

                  {/* 💡 Type - Reads directly from the report object, removed hardcoded default */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.type || "N/A"} 
                  </td>

                  {/* Status */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    <StatusTag status={report.status} />
                  </td>

                  {/* Date */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {moment(report.created_at || Date.now()).format('MMM D, YYYY')}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {(role === "admin" || report.status === "pending") && (
                      <button
                        onClick={() => onEdit(report)}
                        className="text-gray-400 hover:text-gray-600 transition"
                        title="Edit Report"
                      >
                        <SquarePen className="w-5 h-5 inline-block" />
                      </button>
                    )}
                    
                    {role === "admin" && (
                      <button
                        onClick={() => handleInternalDelete(report.id)} 
                        className="text-red-400 hover:text-red-600 transition"
                        title="Delete Report"
                      >
                        <Trash2 className="w-5 h-5 inline-block" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center py-12 text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;