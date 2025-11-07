// import React, { useState, useEffect } from "react";
// import { useUsers } from "../contexts/UserContext";
// import apiService from "../services/api";

// const SimpleAdminDashboard = () => {
//   const { currentUser } = useUsers();
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         console.log("Fetching reports as admin...");
        
//         // Use the API service instead of direct fetch
//         const response = await apiService.get('/reports/all');
//         console.log("API Response:", response);
        
//         // Handle the response structure
//         if (response.success && Array.isArray(response.data)) {
//           setReports(response.data);
//         } else if (Array.isArray(response)) {
//           // Backward compatibility: if response is directly an array
//           setReports(response);
//         } else {
//           throw new Error("Invalid response format from server");
//         }
//       } catch (err) {
//         console.error("Failed to fetch reports:", err);
//         setError(err.message || "Failed to load reports");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (currentUser && currentUser.role === 'admin') {
//       fetchReports();
//     } else {
//       setLoading(false);
//       setError("Admin access required");
//     }
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
//         <span className="ml-2">Loading reports...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         <strong>Error loading reports:</strong> {error}
//         <div className="mt-2">
//           <p>Please check:</p>
//           <ul className="list-disc list-inside">
//             <li>Backend server is running on port 5000</li>
//             <li>The route /api/reports/all exists</li>
//             <li>You have proper admin permissions</li>
//           </ul>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">
//           Admin Dashboard
//         </h1>
//         <p className="text-gray-600">
//           Total Reports: {reports.length}
//         </p>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">
//           All Reports ({reports.length})
//         </h2>
        
//         {reports.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-gray-500 text-lg">No reports submitted yet.</p>
//             <p className="text-gray-400 text-sm mt-2">When users submit reports, they will appear here.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {reports.map((report) => (
//               <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//                 <h3 className="font-semibold text-lg text-gray-900">{report.title}</h3>
//                 <p className="text-gray-600 mt-1">{report.description}</p>
//                 <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
//                   <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                     Type: {report.report_type}
//                   </span>
//                   <span className={`px-2 py-1 rounded ${
//                     report.status === 'resolved' ? 'bg-green-100 text-green-800' :
//                     report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                     report.status === 'under investigation' ? 'bg-blue-100 text-blue-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     Status: {report.status}
//                   </span>
//                   <span>User: {report.user_name || report.email}</span>
//                   <span>Date: {new Date(report.created_at).toLocaleDateString()}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SimpleAdminDashboard;

import React, { useState, useEffect } from "react";
import { useUsers } from "../contexts/UserContext";

const SimpleAdminDashboard = () => {
  const { currentUser } = useUsers();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Fetching reports as admin...");
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        console.log("🔑 Token exists:", !!token);
        
        // Use direct fetch instead of broken apiService
        const response = await fetch('http://localhost:5000/api/reports/all', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        console.log("📡 Response status:", response.status);
        
        const data = await response.json();
        console.log("📦 Full API response:", data);
        
        if (response.ok) {
          // Handle the response
          if (data.success && Array.isArray(data.data)) {
            console.log(`✅ Found ${data.data.length} reports`);
            setReports(data.data);
          } else if (Array.isArray(data)) {
            console.log(`✅ Found ${data.length} reports (direct array)`);
            setReports(data);
          } else {
            console.log("❓ Unexpected response format, setting empty array");
            setReports([]);
          }
        } else {
          console.log("❌ API error:", data);
          throw new Error(data.message || `Failed to fetch reports (HTTP ${response.status})`);
        }
      } catch (err) {
        console.error("💥 Failed to fetch reports:", err);
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.role === 'admin') {
      console.log("👤 Current user is admin, fetching reports...");
      fetchReports();
    } else {
      console.log("❌ User is not admin or not logged in");
      setLoading(false);
      setError(currentUser ? "Admin access required" : "Please log in");
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        <span className="ml-2">Loading reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error loading reports:</strong> {error}
        <div className="mt-2">
          <p>Please check:</p>
          <ul className="list-disc list-inside">
            <li>Backend server is running on port 5000</li>
            <li>The route /api/reports/all exists</li>
            <li>You have proper admin permissions</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Total Reports: {reports.length}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          All Reports ({reports.length})
        </h2>
        
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No reports submitted yet.</p>
            <p className="text-gray-400 text-sm mt-2">When users submit reports, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-semibold text-lg text-gray-900">{report.title}</h3>
                <p className="text-gray-600 mt-1">{report.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Type: {report.report_type}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'under investigation' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Status: {report.status}
                  </span>
                  <span>User: {report.user_name || report.email}</span>
                  <span>Date: {new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;