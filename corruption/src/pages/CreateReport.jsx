
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/CreateReport.css";

// // const CreateReport = () => {
// //   const navigate = useNavigate();
// //   const [currentStep, setCurrentStep] = useState(1);
// //   const [formData, setFormData] = useState({
// //     reportType: 'red-flag',
// //     title: '',
// //     description: '',
// //     location: '',
// //     coordinates: null,
// //     evidence: '',
// //     images: null
// //   });

// const CreateReport = () => {
//   const navigate = useNavigate();
//   const { createReport } = useReports();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     reportType: 'red-flag',
//     title: '',
//     description: '',
//     location: '',
//     coordinates: null,
//     evidence: '',
//     images: null
//   });

//   const steps = [
//     { number: 1, title: 'Basic Info' },
//     { number: 2, title: 'Location' },
//     { number: 3, title: 'Evidence' }
//   ];

//   const updateFormData = (newData) => {
//     setFormData(prev => ({ ...prev, ...newData }));
//   };

//   const nextStep = () => {
//     if (currentStep < steps.length) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       // Save to localStorage (replace with your API call)
//       const existingReports = JSON.parse(localStorage.getItem('myReports')) || [];
//       const newReport = {
//         id: Date.now(),
//         ...formData,
//         date: new Date().toISOString().split('T')[0],
//         status: 'pending'
//       };
      
//       localStorage.setItem('myReports', JSON.stringify([...existingReports, newReport]));
      
//       alert('Report created successfully!');
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Error creating report:', error);
//       alert('Error creating report. Please try again.');
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="form-step">
//             <h2>Basic Information</h2>
            
//             <div className="form-group">
//               <label className="form-label">Report Type *</label>
//               <div className="radio-group">
//                 <label className="radio-option">
//                   <input
//                     type="radio"
//                     name="reportType"
//                     value="red-flag"
//                     checked={formData.reportType === 'red-flag'}
//                     onChange={(e) => updateFormData({ reportType: e.target.value })}
//                   />
//                   <div className="radio-content">
//                     <span className="radio-title">Red Flag</span>
//                     <span className="radio-description">
//                       Report corruption incidents, bribery, or misuse of public funds
//                     </span>
//                   </div>
//                 </label>

//                 <label className="radio-option">
//                   <input
//                     type="radio"
//                     name="reportType"
//                     value="intervention"
//                     checked={formData.reportType === 'intervention'}
//                     onChange={(e) => updateFormData({ reportType: e.target.value })}
//                   />
//                   <div className="radio-content">
//                     <span className="radio-title">Intervention</span>
//                     <span className="radio-description">
//                       Request government intervention for infrastructure issues
//                     </span>
//                   </div>
//                 </label>
//               </div>
//             </div>

//             <div className="form-group">
//               <label className="form-label">Title *</label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) => updateFormData({ title: e.target.value })}
//                 placeholder="Brief title describing the incident"
//                 className="form-input"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Description *</label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => updateFormData({ description: e.target.value })}
//                 placeholder="Provide detailed description of the incident..."
//                 className="form-textarea"
//                 rows="6"
//                 required
//               />
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="form-step">
//             <h2>Location Details</h2>
            
//             <div className="form-group">
//               <label className="form-label">Location *</label>
//               <input
//                 type="text"
//                 value={formData.location}
//                 onChange={(e) => updateFormData({ location: e.target.value })}
//                 placeholder="Enter the location (e.g., Victoria Island, Lagos, Nigeria)"
//                 className="form-input"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Location Coordinates</label>
//               <div className="location-actions">
//                 <button
//                   type="button"
//                   onClick={() => updateFormData({ coordinates: { lat: "6.5244", lng: "3.3792" } })}
//                   className="btn btn-secondary"
//                 >
//                   📍 Use Current Location
//                 </button>
//               </div>
              
//               {formData.coordinates && (
//                 <div className="coordinates-display">
//                   <strong>Current coordinates:</strong> 
//                   {formData.coordinates.lat}, {formData.coordinates.lng}
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="form-step">
//             <h2>Evidence & Documentation</h2>
            
//             <div className="form-group">
//               <label className="form-label">Additional Evidence Details</label>
//               <textarea
//                 value={formData.evidence}
//                 onChange={(e) => updateFormData({ evidence: e.target.value })}
//                 placeholder="Provide any additional evidence details, witness information, etc."
//                 className="form-textarea"
//                 rows="4"
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Upload Images</label>
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={(e) => updateFormData({ images: e.target.files })}
//                 className="form-input"
//               />
//               {formData.images && (
//                 <div className="file-preview">
//                   <p>{formData.images.length} file(s) selected</p>
//                 </div>
//               )}
//             </div>

//             <div className="confirmation-section">
//               <label className="confirmation-checkbox">
//                 <input type="checkbox" required />
//                 <span className="checkmark"></span>
//                 <span className="confirmation-text">
//                   I confirm that the information provided is accurate to the best of my knowledge.
//                 </span>
//               </label>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="create-report-page">
//       <div className="create-report-container">
//         <header className="create-report-header">
//           <h1>Create New Report</h1>
//           <p>Report corruption incidents or request government interventions</p>
//         </header>

//         {/* Progress Steps */}
//         <div className="progress-steps">
//           {steps.map((step, index) => (
//             <div key={step.number} className="step-container">
//               <div className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
//                 <div className="step-number">
//                   {currentStep > step.number ? '✓' : step.number}
//                 </div>
//                 <span className="step-title">{step.title}</span>
//               </div>
//               {index < steps.length - 1 && (
//                 <div className={`step-connector ${currentStep > step.number ? 'active' : ''}`} />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="create-report-form">
//           {renderStep()}

//           {/* Navigation Buttons */}
//           <div className="form-navigation">
//             <button
//               type="button"
//               onClick={prevStep}
//               disabled={currentStep === 1}
//               className="btn btn-secondary"
//             >
//               Previous
//             </button>

//             {currentStep < steps.length ? (
//               <button
//                 type="button"
//                 onClick={nextStep}
//                 className="btn btn-primary"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//               >
//                 Submit Report
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={() => navigate('/dashboard')}
//               className="btn btn-secondary"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateReport;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateReport.css";

// Create a simple report management hook since useReports import is failing
const useReportManager = () => {
  const createReport = (reportData) => {
    const newReport = {
      id: Date.now(),
      ...reportData,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    // Save to localStorage
    const existingReports = JSON.parse(localStorage.getItem('myReports')) || [];
    const updatedReports = [newReport, ...existingReports];
    localStorage.setItem('myReports', JSON.stringify(updatedReports));
    
    // Create notification
    const existingNotifications = JSON.parse(localStorage.getItem('ireporter-notifications')) || [];
    const newNotification = {
      id: Date.now(),
      title: "Report Submitted",
      message: `Your report "${reportData.title}" has been submitted successfully`,
      type: "submission",
      timestamp: new Date().toISOString(),
      read: false,
      reportId: newReport.id
    };
    localStorage.setItem('ireporter-notifications', JSON.stringify([newNotification, ...existingNotifications]));
    
    return newReport;
  };

  return { createReport };
};

const CreateReport = () => {
  const navigate = useNavigate();
  const { createReport } = useReportManager();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    reportType: 'red-flag',
    title: '',
    description: '',
    location: '',
    coordinates: null,
    evidence: '',
    images: null
  });

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Location' },
    { number: 3, title: 'Evidence' }
  ];

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting report with data:', formData);
      
      // Use the local report manager to create report
      const newReport = createReport(formData);
      
      console.log('Report created successfully:', newReport);
      
      alert('Report created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Error creating report. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label className="form-label">Report Type *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="reportType"
                    value="red-flag"
                    checked={formData.reportType === 'red-flag'}
                    onChange={(e) => updateFormData({ reportType: e.target.value })}
                  />
                  <div className="radio-content">
                    <span className="radio-title">Red Flag</span>
                    <span className="radio-description">
                      Report corruption incidents, bribery, or misuse of public funds
                    </span>
                  </div>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="reportType"
                    value="intervention"
                    checked={formData.reportType === 'intervention'}
                    onChange={(e) => updateFormData({ reportType: e.target.value })}
                  />
                  <div className="radio-content">
                    <span className="radio-title">Intervention</span>
                    <span className="radio-description">
                      Request government intervention for infrastructure issues
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="Brief title describing the incident"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Provide detailed description of the incident..."
                className="form-textarea"
                rows="6"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h2>Location Details</h2>
            
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateFormData({ location: e.target.value })}
                placeholder="Enter the location (e.g., Victoria Island, Lagos, Nigeria)"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location Coordinates</label>
              <div className="location-actions">
                <button
                  type="button"
                  onClick={() => updateFormData({ coordinates: { lat: "6.5244", lng: "3.3792" } })}
                  className="btn btn-secondary"
                >
                  📍 Use Current Location
                </button>
              </div>
              
              {formData.coordinates && (
                <div className="coordinates-display">
                  <strong>Current coordinates:</strong> 
                  {formData.coordinates.lat}, {formData.coordinates.lng}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h2>Evidence & Documentation</h2>
            
            <div className="form-group">
              <label className="form-label">Additional Evidence Details</label>
              <textarea
                value={formData.evidence}
                onChange={(e) => updateFormData({ evidence: e.target.value })}
                placeholder="Provide any additional evidence details, witness information, etc."
                className="form-textarea"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => updateFormData({ images: e.target.files })}
                className="form-input"
              />
              {formData.images && (
                <div className="file-preview">
                  <p>{formData.images.length} file(s) selected</p>
                </div>
              )}
            </div>

            <div className="confirmation-section">
              <label className="confirmation-checkbox">
                <input type="checkbox" required />
                <span className="checkmark"></span>
                <span className="confirmation-text">
                  I confirm that the information provided is accurate to the best of my knowledge.
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="create-report-page">
      <div className="create-report-container">
        <header className="create-report-header">
          <h1>Create New Report</h1>
          <p>Report corruption incidents or request government interventions</p>
        </header>

        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div key={step.number} className="step-container">
              <div className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                <div className="step-number">
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <span className="step-title">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${currentStep > step.number ? 'active' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="create-report-form">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn btn-secondary"
            >
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
              >
                Submit Report
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;

