// import React from "react";
// import { Upload } from "lucide-react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";

// // Default Leaflet marker
// const markerIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// // Step completion check
// const isStepComplete = (step, formData) => {
//   switch (step) {
//     case 1:
//       return formData.title && formData.specificTitle && formData.description;
//     case 2:
//       return formData.location && formData.lat !== "" && formData.lng !== "";
//     case 3:
//       return true;
//     default:
//       return false;
//   }
// };

// const ReportStepper = ({ currentStep, nextStep, prevStep, formData, setFormData, handleSubmit }) => {
//   const steps = [
//     { label: "Type & Description" },
//     { label: "Location & Map" },
//     { label: "Review & Submit" },
//   ];

//   // Convert file to Base64 for persistence
//   const handleMediaChange = (file) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFormData((prev) => ({ ...prev, media: reader.result }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleNext = () => {
//     if (isStepComplete(currentStep, formData)) {
//       nextStep();
//     } else {
//       alert("Please complete all fields in this step before proceeding.");
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-50 rounded-lg shadow-md max-h-[90vh] overflow-y-auto">

//       {/* Step indicators */}
//       <div className="flex justify-between mb-6 relative">
//         {steps.map((step, index) => {
//           const complete = isStepComplete(index + 1, formData);
//           const inProgress = currentStep === index + 1;
//           return (
//             <React.Fragment key={index}>
//               <div className="flex flex-col items-center relative z-10 w-1/3">
//                 <div
//                   className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white ${
//                     complete ? "bg-teal-500" : inProgress ? "bg-blue-500" : "bg-gray-300"
//                   } transition-colors duration-500`}
//                 >
//                   {index + 1}
//                 </div>
//                 <p className="text-xs mt-1 text-center">{step.label}</p>
//               </div>
//               {index < steps.length - 1 && (
//                 <div className="absolute top-3 left-1/3 w-1/3 h-1 bg-gray-300 rounded-full z-0">
//                   <div
//                     className="h-1 rounded-full transition-all duration-500"
//                     style={{ width: complete ? "100%" : "0%", backgroundColor: "green" }}
//                   />
//                 </div>
//               )}
//             </React.Fragment>
//           );
//         })}
//       </div>

//       {/* Step content */}
//       <div className="flex-1 overflow-y-auto space-y-4">
//         {/* Step 1 */}
//         {currentStep === 1 && (
//           <div className="space-y-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-3 border-b">
//               <label className="text-gray-700 font-semibold text-base whitespace-nowrap">Report Type:</label>
//               <label className="flex items-center space-x-2 cursor-pointer text-red-600 hover:text-red-700">
//                 <input
//                   type="radio"
//                   value="Red Flag"
//                   checked={formData.title === "Red Flag"}
//                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                   className="form-radio h-5 w-5 border-red-400 text-red-600 focus:ring-red-500"
//                 />
//                 <span className="text-sm font-medium">Red Flag (Urgent)</span>
//               </label>
//               <label className="flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-700">
//                 <input
//                   type="radio"
//                   value="Intervention"
//                   checked={formData.title === "Intervention"}
//                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                   className="form-radio h-5 w-5 border-blue-400 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="text-sm font-medium">Intervention (Action Taken)</span>
//               </label>
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Report Title</label>
//               <input
//                 type="text"
//                 placeholder="E.g., Unauthorized Server Access in West Wing"
//                 value={formData.specificTitle}
//                 onChange={(e) => setFormData({ ...formData, specificTitle: e.target.value })}
//                 className="border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 rounded-md w-full text-lg font-medium shadow-sm"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Description</label>
//               <textarea
//                 placeholder="Provide a detailed account of the event..."
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 className="border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 rounded-md w-full h-36 shadow-sm resize-y"
//               />
//             </div>
//           </div>
//         )}

//         {/* Step 2 */}
//         {currentStep === 2 && (
//           <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col md:flex-row gap-4 max-h-[70vh] overflow-hidden">
//             {/* Inputs */}
//             <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2">
//               <input
//                 type="text"
//                 placeholder="Location / Address"
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                 className="border p-2 rounded w-full"
//               />
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   placeholder="Latitude"
//                   value={formData.lat}
//                   onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
//                   className="border p-2 rounded w-1/2"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Longitude"
//                   value={formData.lng}
//                   onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
//                   className="border p-2 rounded w-1/2"
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <Upload className="text-gray-500 w-5 h-5" />
//                 <input
//                   type="file"
//                   accept="image/*,video/*"
//                   onChange={(e) => e.target.files[0] && handleMediaChange(e.target.files[0])}
//                   className="border p-2 rounded w-full"
//                 />
//               </div>

//               {formData.media && (
//                 <div>
//                   {formData.media.startsWith("data:image") ? (
//                     <img src={formData.media} alt="media" className="rounded-md w-full h-32 object-cover mt-2" />
//                   ) : (
//                     <video src={formData.media} controls className="rounded-md w-full h-32 object-cover mt-2" />
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Map */}
//             <div className="flex-1 min-h-0 h-64 md:h-auto">
//               <MapContainer
//                 center={[parseFloat(formData.lat) || 0, parseFloat(formData.lng) || 0]}
//                 zoom={13}
//                 scrollWheelZoom={false}
//                 className="w-full h-full rounded"
//               >
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker
//                   position={[parseFloat(formData.lat) || 0, parseFloat(formData.lng) || 0]}
//                   icon={markerIcon}
//                 >
//                   <Popup>{formData.location || "No Location"}</Popup>
//                 </Marker>
//               </MapContainer>
//             </div>
//           </div>
//         )}

//         {/* Step 3 */}
//         {currentStep === 3 && (
//           <div className="space-y-2 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
//             <p><strong>Type:</strong> {formData.title}</p>
//             <p><strong>Title:</strong> {formData.specificTitle}</p>
//             <p><strong>Description:</strong> {formData.description}</p>
//             <p><strong>Location:</strong> {formData.location}</p>
//             <p><strong>Coordinates:</strong> {formData.lat}, {formData.lng}</p>

//             {formData.media && (
//               formData.media.startsWith("data:image") ? (
//                 <img src={formData.media} alt="media" className="rounded-md w-full h-48 object-cover" />
//               ) : (
//                 <video src={formData.media} controls className="rounded-md w-full h-48 object-cover" />
//               )
//             )}
//           </div>
//         )}
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-between mt-4">
//         {currentStep > 1 && (
//           <button onClick={prevStep} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Back</button>
//         )}
//         {currentStep < 3 && (
//           <button onClick={handleNext} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ml-auto">Next</button>
//         )}
//         {currentStep === 3 && (
//           <button onClick={handleSubmit} className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-green-600 ml-auto">Submit</button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReportStepper;


import React, { useState, useEffect } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon for leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Helper to validate coordinates
const isValidCoordinate = (lat, lng) => {
  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);
  return !isNaN(numLat) && !isNaN(numLng) && 
         numLat >= -90 && numLat <= 90 && 
         numLng >= -180 && numLng <= 180;
};

// Helper to check if step is complete
const isStepComplete = (step, formData, errors) => {
  switch (step) {
    case 1:
      return formData.title && formData.specificTitle && formData.description && !errors.specificTitle && !errors.description;
    case 2:
      return formData.location && formData.lat && formData.lng && !errors.lat && !errors.lng;
    case 3:
      return true;
    default:
      return false;
  }
};

const ReportStepper = ({ reportToEdit = null, onClose, handleSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    specificTitle: "",
    description: "",
    location: "",
    lat: "",
    lng: "",
    media: null,
  });
  const [errors, setErrors] = useState({
    specificTitle: "",
    description: "",
    lat: "",
    lng: ""
  });

  // Load report to edit
  useEffect(() => {
    if (reportToEdit) {
      setFormData({
        title: reportToEdit.report_type === "red-flag" ? "Red Flag" : "Intervention",
        specificTitle: reportToEdit.title || "",
        description: reportToEdit.description || "",
        location: reportToEdit.location || "",
        lat: reportToEdit.latitude?.toString() || "",
        lng: reportToEdit.longitude?.toString() || "",
        media: null,
      });
    }
  }, [reportToEdit]);

  // Validate fields on change
  const validateField = (name, value) => {
    switch (name) {
      case 'specificTitle':
        return value.length < 5 ? 'Title must be at least 5 characters' : '';
      case 'description':
        return value.length < 10 ? 'Description must be at least 10 characters' : '';
      case 'lat':
        const latNum = parseFloat(value);
        if (isNaN(latNum)) return 'Latitude must be a number';
        if (latNum < -90 || latNum > 90) return 'Latitude must be between -90 and 90';
        return '';
      case 'lng':
        const lngNum = parseFloat(value);
        if (isNaN(lngNum)) return 'Longitude must be a number';
        if (lngNum < -180 || lngNum > 180) return 'Longitude must be between -180 and 180';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate the field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleNext = () => {
    // Validate current step before proceeding
    let stepValid = true;
    const newErrors = { ...errors };

    if (currentStep === 1) {
      if (!formData.specificTitle) {
        newErrors.specificTitle = 'Title is required';
        stepValid = false;
      }
      if (!formData.description) {
        newErrors.description = 'Description is required';
        stepValid = false;
      }
    } else if (currentStep === 2) {
      if (!formData.lat) {
        newErrors.lat = 'Latitude is required';
        stepValid = false;
      }
      if (!formData.lng) {
        newErrors.lng = 'Longitude is required';
        stepValid = false;
      }
    }

    setErrors(newErrors);

    if (stepValid && isStepComplete(currentStep, formData, errors)) {
      nextStep();
    } else {
      alert("Please fix the errors before proceeding.");
    }
  };

  const handleFormSubmit = async () => {
    try {
      // Final validation before submission
      if (!isValidCoordinate(formData.lat, formData.lng)) {
        alert("Please enter valid coordinates. Latitude: -90 to 90, Longitude: -180 to 180");
        setCurrentStep(2); // Go back to location step
        return;
      }
console.log('Form data before submit:', formData);
      // Fix coordinates format for backend - send as string "lat,lng"
      const reportPayload = {
        title: formData.specificTitle,
        reportType: formData.title.toLowerCase() === "red flag" ? "red-flag" : "intervention",
        description: formData.description,
        location: formData.location,
        coordinates: `${formData.lat},${formData.lng}`, // ✅ FIXED: Send as string
        date: new Date().toISOString().split('T')[0],
      };

      console.log('🔄 Submitting report payload:', reportPayload);

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(reportPayload).forEach(key => {
        formDataToSend.append(key, reportPayload[key]);
      });

      // Append file if exists
      if (formData.media) {
        formDataToSend.append('evidence', formData.media);
        console.log('📎 Attaching file:', formData.media.name);
      }

      await handleSubmit(formDataToSend);
      
    } catch (error) {
      console.error('❌ Report submission failed:', error);
      alert(`Failed to submit report: ${error.message}`);
    }
  };

  const steps = [
    { label: "Type & Description" },
    { label: "Location & Map" },
    { label: "Review & Submit" },
  ];

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md max-h-[90vh] overflow-y-auto">
      {/* Step indicators */}
      <div className="flex justify-between mb-6 relative">
        {steps.map((step, index) => {
          const complete = isStepComplete(index + 1, formData, errors);
          const inProgress = currentStep === index + 1;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white ${
                  complete ? "bg-teal-500" : inProgress ? "bg-blue-500" : "bg-gray-300"
                } transition-colors duration-500`}
              >
                {index + 1}
              </div>
              <p className="text-xs mt-1 text-center">{step.label}</p>
              {index < steps.length - 1 && (
                <div className="w-full h-1 mt-3 bg-gray-200 rounded-full">
                  <div
                    className="h-1 rounded-full"
                    style={{ width: complete ? "100%" : "0%", backgroundColor: complete ? "green" : "transparent" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-3 border-b">
              <label className="text-gray-700 font-semibold text-base whitespace-nowrap">Report Type:</label>
              <label className="flex items-center space-x-2 cursor-pointer text-red-600 hover:text-red-700">
                <input
                  type="radio"
                  value="Red Flag"
                  checked={formData.title === "Red Flag"}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-radio h-5 w-5 border-red-400 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium">Red Flag (Urgent)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-700">
                <input
                  type="radio"
                  value="Intervention"
                  checked={formData.title === "Intervention"}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-radio h-5 w-5 border-blue-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Intervention (Action Taken)</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Report Title *</label>
              <input
                type="text"
                placeholder="E.g., Unauthorized Server Access"
                value={formData.specificTitle || ""}
                onChange={(e) => handleInputChange('specificTitle', e.target.value)}
                className={`border p-3 rounded-md w-full text-lg font-medium shadow-sm ${
                  errors.specificTitle ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
                } focus:ring-1 focus:ring-indigo-500`}
              />
              {errors.specificTitle && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.specificTitle}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                placeholder="Provide a detailed account of the event..."
                value={formData.description || ""}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`border p-3 rounded-md w-full h-36 shadow-sm resize-y ${
                  errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
                } focus:ring-1 focus:ring-indigo-500`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col md:flex-row gap-4 max-h-[70vh] overflow-hidden">
            {/* Left: Inputs */}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location / Address *</label>
                <input
                  type="text"
                  placeholder="Enter location or address"
                  value={formData.location || ""}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="border p-2 rounded w-full focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Latitude *</label>
                  <input
                    type="text"
                    placeholder="e.g., -1.2921"
                    value={formData.lat || ""}
                    onChange={(e) => handleInputChange('lat', e.target.value)}
                    className={`border p-2 rounded w-full ${
                      errors.lat ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
                    } focus:ring-1 focus:ring-indigo-500`}
                  />
                  {errors.lat && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lat}
                    </p>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Longitude *</label>
                  <input
                    type="text"
                    placeholder="e.g., 36.8219"
                    value={formData.lng || ""}
                    onChange={(e) => handleInputChange('lng', e.target.value)}
                    className={`border p-2 rounded w-full ${
                      errors.lng ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
                    } focus:ring-1 focus:ring-indigo-500`}
                  />
                  {errors.lng && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lng}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Latitude must be between -90 and 90, Longitude between -180 and 180.
                  <br />
                  <strong>Example:</strong> Nairobi, Kenya ≈ -1.2921, 36.8219
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Evidence (Optional)</label>
                <div className="flex items-center gap-2">
                  <Upload className="text-gray-500 w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setFormData({ ...formData, media: e.target.files?.[0] })}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>

              {formData.media && (
                <div>
                  <p className="text-sm text-gray-600">Selected file: {formData.media.name}</p>
                  {formData.media.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(formData.media)}
                      alt="media"
                      className="rounded-md w-full h-32 object-cover mt-2"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(formData.media)}
                      controls
                      className="rounded-md w-full h-32 object-cover mt-2"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right: Map */}
            <div className="flex-1 min-h-0 h-64 md:h-auto">
              <MapContainer
                center={[parseFloat(formData.lat) || -1.2921, parseFloat(formData.lng) || 36.8219]}
                zoom={13}
                scrollWheelZoom={false}
                className="w-full h-full rounded"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {isValidCoordinate(formData.lat, formData.lng) && (
                  <Marker
                    position={[parseFloat(formData.lat), parseFloat(formData.lng)]}
                    icon={markerIcon}
                  >
                    <Popup>{formData.location || "Selected Location"}</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Report</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Type:</strong> {formData.title}</p>
                <p><strong>Title:</strong> {formData.specificTitle}</p>
                <p><strong>Description:</strong> {formData.description}</p>
              </div>
              <div>
                <p><strong>Location:</strong> {formData.location}</p>
                <p><strong>Coordinates:</strong> {formData.lat}, {formData.lng}</p>
                <p><strong>Coordinates Valid:</strong> 
                  <span className={isValidCoordinate(formData.lat, formData.lng) ? "text-green-600" : "text-red-600"}>
                    {isValidCoordinate(formData.lat, formData.lng) ? " Yes" : " No - Please go back and fix"}
                  </span>
                </p>
              </div>
            </div>

            {formData.media && (
              <div>
                <p><strong>Attached File:</strong> {formData.media.name}</p>
                {formData.media.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(formData.media)}
                    alt="media"
                    className="rounded-md w-full h-48 object-cover mt-2"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(formData.media)}
                    controls
                    className="rounded-md w-full h-48 object-cover mt-2"
                  />
                )}
              </div>
            )}

            {!isValidCoordinate(formData.lat, formData.lng) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <strong>Invalid Coordinates:</strong> Please go back to Step 2 and enter valid coordinates.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <button onClick={prevStep} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
            Back
          </button>
        )}
        {currentStep < 3 && (
          <button 
            onClick={handleNext} 
            disabled={!isStepComplete(currentStep, formData, errors)}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto"
          >
            Next
          </button>
        )}
        {currentStep === 3 && (
          <button 
            onClick={handleFormSubmit} 
            disabled={!isValidCoordinate(formData.lat, formData.lng)}
            className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto"
          >
            Submit Report
          </button>
          
        )}
        
      </div>
    </div>
  );
};

export default ReportStepper;
