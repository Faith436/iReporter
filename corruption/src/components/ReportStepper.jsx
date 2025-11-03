import React, { useState, useEffect } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Default Leaflet marker
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Coordinate validation
const isValidCoordinate = (lat, lng) => {
  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);
  return (
    !isNaN(numLat) &&
    !isNaN(numLng) &&
    numLat >= -90 &&
    numLat <= 90 &&
    numLng >= -180 &&
    numLng <= 180
  );
};

// Step completion validation
const isStepComplete = (step, formData, errors) => {
  switch (step) {
    case 1:
      return (
        formData.title &&
        formData.specificTitle &&
        formData.description &&
        !errors.specificTitle &&
        !errors.description
      );
    case 2:
      return (
        formData.location &&
        formData.lat &&
        formData.lng &&
        !errors.lat &&
        !errors.lng
      );
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
    lng: "",
  });

  // Load report to edit
  useEffect(() => {
    if (reportToEdit) {
      setFormData({
        title:
          reportToEdit.report_type === "red-flag"
            ? "Red Flag"
            : "Intervention",
        specificTitle: reportToEdit.title || "",
        description: reportToEdit.description || "",
        location: reportToEdit.location || "",
        lat: reportToEdit.latitude?.toString() || "",
        lng: reportToEdit.longitude?.toString() || "",
        media: null,
      });
    }
  }, [reportToEdit]);
}
  // Field validation
  const validateField = (name, value) => {
    switch (name) {
      case "specificTitle":
        return value.length < 5 ? "Title must be at least 5 characters" : "";
      case "description":
        return value.length < 10
          ? "Description must be at least 10 characters"
          : "";
      case "lat":
        const latNum = parseFloat(value);
        if (isNaN(latNum)) return "Latitude must be a number";
        if (latNum < -90 || latNum > 90)
          return "Latitude must be between -90 and 90";
        return "";
      case "lng":
        const lngNum = parseFloat(value);
        if (isNaN(lngNum)) return "Longitude must be a number";
        if (lngNum < -180 || lngNum > 180)
          return "Longitude must be between -180 and 180";
        return "";
      default:
        return "";
    }
  };

  // Handle input change + validation
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Step validation
  const handleNext = () => {
    let stepValid = true;
    const newErrors = { ...errors };

    if (currentStep === 1) {
      if (!formData.specificTitle) {
        newErrors.specificTitle = "Title is required";
        stepValid = false;
      }
      if (!formData.description) {
        newErrors.description = "Description is required";
        stepValid = false;
      }
    } else if (currentStep === 2) {
      if (!formData.lat) {
        newErrors.lat = "Latitude is required";
        stepValid = false;
      }
      if (!formData.lng) {
        newErrors.lng = "Longitude is required";
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

  // Submit handler
  const handleFormSubmit = async () =>{
    if (!isValidCoordinate(formData.lat, formData.lng)) {
      alert(
        "Please enter valid coordinates. Latitude: -90 to 90, Longitude: -180 to 180"
      );
      setCurrentStep(2);
      return;
    }

  const steps = [
    { label: "Type & Description" },
    { label: "Location & Map" },
    { label: "Review & Submit" },
  ];

  const lat = parseFloat(formData.lat) || 0;
  const lng = parseFloat(formData.lng) || 0;

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md max-h-[90vh] overflow-y-auto">
      {/* Step Indicators */}
      <div className="flex justify-between mb-6 relative">
        {steps.map((step, index) => {
          const complete = isStepComplete(index + 1, formData, errors);
          const inProgress = currentStep === index + 1;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white ${
                  complete
                    ? "bg-teal-500"
                    : inProgress
                    ? "bg-blue-500"
                    : "bg-gray-300"
                } transition-colors duration-500`}
              >
                {index + 1}
              </div>
              <p className="text-xs mt-1 text-center">{step.label}</p>
              {index < steps.length - 1 && (
                <div className="w-full h-1 mt-3 bg-gray-200 rounded-full">
                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: complete ? "100%" : "0%",
                      backgroundColor: complete ? "green" : "transparent",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-3 border-b">
              <label className="text-gray-700 font-semibold text-base whitespace-nowrap">
                Report Type:
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-red-600 hover:text-red-700">
                <input
                  type="radio"
                  value="Red Flag"
                  checked={formData.title === "Red Flag"}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="form-radio h-5 w-5 border-red-400 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium">
                  Red Flag (Urgent)
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-700">
                <input
                  type="radio"
                  value="Intervention"
                  checked={formData.title === "Intervention"}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="form-radio h-5 w-5 border-blue-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">
                  Intervention (Action Taken)
                </span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Report Title *
              </label>
              <input
                type="text"
                placeholder="E.g., Unauthorized Access"
                value={formData.specificTitle || ""}
                onChange={(e) =>
                  handleInputChange("specificTitle", e.target.value)
                }
                className={`border p-3 rounded-md w-full text-lg font-medium shadow-sm ${
                  errors.specificTitle
                    ? "border-red-500"
                    : "border-gray-300 focus:border-indigo-500"
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
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                placeholder="Provide details..."
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`border p-3 rounded-md w-full h-36 shadow-sm resize-y ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 focus:border-indigo-500"
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
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2">
              <label className="block text-sm font-medium text-gray-700">
                Location / Address *
              </label>
              <input
                type="text"
                placeholder="Enter location"
                value={formData.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="border p-2 rounded w-full focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., -1.2921"
                    value={formData.lat || ""}
                    onChange={(e) => handleInputChange("lat", e.target.value)}
                    className={`border p-2 rounded w-full ${
                      errors.lat
                        ? "border-red-500"
                        : "border-gray-300 focus:border-indigo-500"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 36.8219"
                    value={formData.lng || ""}
                    onChange={(e) => handleInputChange("lng", e.target.value)}
                    className={`border p-2 rounded w-full ${
                      errors.lng
                        ? "border-red-500"
                        : "border-gray-300 focus:border-indigo-500"
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

              {/* File Upload */}
              <div className="flex flex-col gap-2 mt-3">
                <label className="flex items-center gap-2 cursor-pointer border p-2 rounded hover:bg-gray-100">
                  <Upload className="text-gray-500 w-5 h-5" />
                  <span className="text-sm text-gray-600">
                    Upload images/videos
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        media: e.target.files[0],
                      }))
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Map */}
            <div className="flex-1 min-h-0 h-64 md:h-auto">
              <MapContainer
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom={false}
                className="w-full h-full rounded"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} icon={markerIcon}>
                  <Popup>{formData.location || "No Location"}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-2 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <p>
              <strong>Type:</strong> {formData.title}
            </p>
            <p>
              <strong>Title:</strong> {formData.specificTitle}
            </p>
            <p>
              <strong>Description:</strong> {formData.description}
            </p>
            <p>
              <strong>Location:</strong> {formData.location}
            </p>
            <p>
              <strong>Coordinates:</strong> {formData.lat}, {formData.lng}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Back
          </button>
        )}
        {currentStep < 3 && (
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ml-auto"
          >
            Next
          </button>
        )}
        {currentStep === 3 && (
          <button
            onClick={handleFormSubmit}
            className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-green-600 ml-auto"
          >
            Submit
          </button>
          
        )}
        
      </div>
    </div>
  );
};

export default ReportStepper;
