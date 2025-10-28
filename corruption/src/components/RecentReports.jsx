import React from "react";
import { Upload } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker
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
      return formData.location && formData.lat !== "" && formData.lng !== "" && formData.media;
    case 3:
      return true;
    default:
      return false;
  }
};

const ReportStepper = ({ currentStep, nextStep, prevStep, formData, setFormData, handleSubmit }) => {
  const steps = [
    { label: "Type & Description" },
    { label: "Location & Map" },
    { label: "Review & Submit" },
  ];

  const handleNext = () => {
    if (isStepComplete(currentStep, formData)) {
      nextStep();
    } else {
      alert("Please complete all fields in this step before proceeding.");
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md max-h-[90vh] overflow-y-auto">
      
      {/* Step indicators */}
      <div className="flex justify-between mb-6 relative">
        {steps.map((step, index) => {
          const complete = isStepComplete(index + 1, formData);
          const inProgress = currentStep === index + 1;
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center relative z-10 w-1/3">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white ${complete ? "bg-teal-500" : inProgress ? "bg-blue-500" : "bg-gray-300"} transition-colors duration-500`}>
                  {index + 1}
                </div>
                <p className="text-xs mt-1 text-center">{step.label}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute top-3 left-1/3 w-1/3 h-1 bg-gray-300 rounded-full z-0">
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: complete ? "100%" : "0%",
                      backgroundColor: "green",
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
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
              <label className="block text-sm font-medium text-gray-700">Report Title</label>
              <input
                type="text"
                placeholder="E.g., Unauthorized Server Access in West Wing"
                value={formData.specificTitle}
                onChange={(e) => setFormData({ ...formData, specificTitle: e.target.value })}
                className="border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 rounded-md w-full text-lg font-medium shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Provide a detailed account of the event..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 rounded-md w-full h-36 shadow-sm resize-y"
              />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col md:flex-row gap-4 max-h-[70vh] overflow-hidden">
            {/* Left: Inputs */}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2">
              <input
                type="text"
                placeholder="Location / Address"
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
              <div className="flex items-center gap-2">
                <Upload className="text-gray-500 w-5 h-5" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setFormData({ ...formData, media: e.target.files[0] })}
                  className="border p-2 rounded w-full"
                />
              </div>

              {formData.media && (
                <div>
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

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-2 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <p><strong>Type:</strong> {formData.title}</p>
            <p><strong>Title:</strong> {formData.specificTitle}</p>
            <p><strong>Description:</strong> {formData.description}</p>
            <p><strong>Location:</strong> {formData.location}</p>
            <p><strong>Coordinates:</strong> {formData.lat}, {formData.lng}</p>

            {formData.media && (
              <div>
                {formData.media.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(formData.media)}
                    alt="media"
                    className="rounded-md w-full h-48 object-cover"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(formData.media)}
                    controls
                    className="rounded-md w-full h-48 object-cover"
                  />
                )}
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
          <button onClick={handleNext} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ml-auto">
            Next
          </button>
        )}
        {currentStep === 3 && (
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-green-600 ml-auto">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportStepper;