import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useReports } from "../contexts/ReportContext";
import { useAuth } from "../contexts/AuthContext"; // assuming you have this for JWT

// Leaflet marker fix
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const isStepComplete = (step, formData) => {
  switch (step) {
    case 1:
      return formData.title && formData.specificTitle && formData.description;
    case 2:
      return formData.location && formData.lat && formData.lng;
    case 3:
      return true;
    default:
      return false;
  }
};

const ReportStepper = ({ reportToEdit = null, onClose }) => {
  const { createReport, updateReport } = useReports();
  const { token } = useAuth(); // JWT token
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

  useEffect(() => {
    if (reportToEdit) {
      setFormData({
        title: reportToEdit.reportType === "red-flag" ? "Red Flag" : "Intervention",
        specificTitle: reportToEdit.title,
        description: reportToEdit.description,
        location: reportToEdit.location || "",
        lat: reportToEdit.coordinates?.lat || "",
        lng: reportToEdit.coordinates?.lng || "",
        media: reportToEdit.media || null,
      });
    }
  }, [reportToEdit]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleNext = () => {
    if (isStepComplete(currentStep, formData)) nextStep();
    else alert("Please complete all fields in this step before proceeding.");
  };

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append("title", formData.specificTitle);
      payload.append(
        "reportType",
        formData.title.toLowerCase() === "red flag" ? "red-flag" : "intervention"
      );
      payload.append("description", formData.description);
      payload.append("location", formData.location);
      payload.append("lat", formData.lat);
      payload.append("lng", formData.lng);
      if (formData.media) payload.append("media", formData.media);

      if (reportToEdit) {
        await updateReport(reportToEdit.id, payload, token);
      } else {
        const newReport = await createReport(payload, token);
        console.log("Report submitted:", newReport);
      }

      if (onClose) onClose(); // close modal safely
      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Report submission error:", error);
      alert("Failed to submit report. Please try again.");
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
          const complete = isStepComplete(index + 1, formData);
          const inProgress = currentStep === index + 1;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white ${
                  complete ? "bg-teal-500" : inProgress ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
              <p className="text-xs mt-1 text-center">{step.label}</p>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {currentStep === 1 && (
          <div className="space-y-4 p-4 bg-white border rounded-md">
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  value="Red Flag"
                  checked={formData.title === "Red Flag"}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                Red Flag
              </label>
              <label>
                <input
                  type="radio"
                  value="Intervention"
                  checked={formData.title === "Intervention"}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                Intervention
              </label>
            </div>
            <input
              type="text"
              placeholder="Report Title"
              value={formData.specificTitle}
              onChange={(e) => setFormData({ ...formData, specificTitle: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border p-2 rounded w-full h-32"
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="p-4 bg-white border rounded-md flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="border p-2 rounded w-1/2"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="border p-2 rounded w-1/2"
                />
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFormData({ ...formData, media: e.target.files?.[0] })}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex-1 h-64 md:h-auto">
              <MapContainer
                center={[parseFloat(formData.lat) || 0, parseFloat(formData.lng) || 0]}
                zoom={13}
                scrollWheelZoom={false}
                className="w-full h-full rounded"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[parseFloat(formData.lat) || 0, parseFloat(formData.lng) || 0]}
                  icon={markerIcon}
                >
                  <Popup>{formData.location || "No Location"}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="p-4 bg-white border rounded-md space-y-2">
            <p><strong>Type:</strong> {formData.title}</p>
            <p><strong>Title:</strong> {formData.specificTitle}</p>
            <p><strong>Description:</strong> {formData.description}</p>
            <p><strong>Location:</strong> {formData.location}</p>
            <p><strong>Coordinates:</strong> {formData.lat}, {formData.lng}</p>
            {formData.media && (
              <>
                {formData.media.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(formData.media)}
                    alt="media"
                    className="w-full h-48 object-cover rounded"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(formData.media)}
                    controls
                    className="w-full h-48 object-cover rounded"
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <button onClick={prevStep} className="px-4 py-2 rounded bg-gray-300">
            Back
          </button>
        )}
        {currentStep < 3 && (
          <button onClick={handleNext} className="px-4 py-2 rounded bg-blue-500 text-white ml-auto">
            Next
          </button>
        )}
        {currentStep === 3 && (
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-teal-500 text-white ml-auto">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportStepper;
