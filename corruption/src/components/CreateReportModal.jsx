import React, { useState } from "react";
import { X, MapPin, Upload, CheckCircle } from "lucide-react";

const CreateReportModal = ({ isOpen, onClose, onSave, reportToEdit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    reportType: "red-flag",
    title: "",
    description: "",
    location: "",
    coordinates: null,
    evidence: "",
  });

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      if (reportToEdit) {
        setFormData({
          reportType: reportToEdit.reportType || "red-flag",
          title: reportToEdit.title || "",
          description: reportToEdit.description || "",
          location: reportToEdit.location || "",
          coordinates: reportToEdit.coordinates || null,
          evidence: reportToEdit.evidence || "",
        });
      } else {
        setFormData({
          reportType: "red-flag",
          title: "",
          description: "",
          location: "",
          coordinates: null,
          evidence: "",
        });
      }
      setCurrentStep(1);
      setShowSuccess(false);
    }
  }, [isOpen, reportToEdit]);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    // Prepare report data with user info
    const reportData = {
      ...formData,
      userId: currentUser?.id,
      userName: currentUser?.name,
      status: "pending",
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
    };

    // Call the save function from Dashboard
    onSave(reportData);
    
    // Show success message
    setShowSuccess(true);
    
    // Close modal after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateFormData({
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          alert("Unable to get your location. Please enter coordinates manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your {formData.reportType === "red-flag" ? "Red Flag" : "Intervention"} report has been successfully submitted and is now under review.
          </p>
          <div className="w-12 h-1 bg-green-500 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {reportToEdit ? "Edit Report" : "Create New Report"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  currentStep >= step ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                {step}
              </div>
              <span className="text-xs mt-2 text-gray-600 text-center">
                {step === 1 ? "Basic Info" : step === 2 ? "Location" : "Review"}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Report Type & Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateFormData({ reportType: "red-flag" })}
                  className={`p-4 border-2 rounded-lg text-left transition duration-200 ${
                    formData.reportType === "red-flag"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-semibold text-gray-900">🚩 Red Flag</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Report corruption, bribery, or misuse of funds
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData({ reportType: "intervention" })}
                  className={`p-4 border-2 rounded-lg text-left transition duration-200 ${
                    formData.reportType === "intervention"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-semibold text-gray-900">🛠️ Intervention</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Request infrastructure repairs or improvements
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="Brief title describing the incident"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Provide detailed description of what happened..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Address
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateFormData({ location: e.target.value })}
                placeholder="Enter the exact location or address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Coordinates
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200 mb-3"
              >
                <MapPin className="w-4 h-4" />
                Use Current Location
              </button>
              {formData.coordinates && (
                <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Coordinates:</strong> {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Evidence
              </label>
              <textarea
                value={formData.evidence}
                onChange={(e) => updateFormData({ evidence: e.target.value })}
                placeholder="Any additional evidence, witness information, or supporting details..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Review and Submit */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Report</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <strong>Report Type:</strong> 
                <span className="ml-2 capitalize">
                  {formData.reportType === "red-flag" ? "🚩 Red Flag" : "🛠️ Intervention"}
                </span>
              </div>
              
              <div>
                <strong>Title:</strong>
                <p className="mt-1 text-gray-700">{formData.title || "Not provided"}</p>
              </div>
              
              <div>
                <strong>Description:</strong>
                <p className="mt-1 text-gray-700">{formData.description || "Not provided"}</p>
              </div>
              
              <div>
                <strong>Location:</strong>
                <p className="mt-1 text-gray-700">{formData.location || "Not provided"}</p>
              </div>
              
              {formData.coordinates && (
                <div>
                  <strong>Coordinates:</strong>
                  <p className="mt-1 text-gray-700">
                    {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                  </p>
                </div>
              )}
              
              {formData.evidence && (
                <div>
                  <strong>Additional Evidence:</strong>
                  <p className="mt-1 text-gray-700">{formData.evidence}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Submit Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateReportModal;