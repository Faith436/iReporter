import React from "react";
import ReportStepper from "./ReportStepper";

const ReportModal = ({ showModal, onClose, editingReport, formData, setFormData, currentStep, nextStep, prevStep, handleSubmit }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg relative w-[90%] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {editingReport ? "Edit Report" : "Add Report"}
        </h2>

        <ReportStepper
          currentStep={currentStep}
          nextStep={nextStep}
          prevStep={prevStep}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ReportModal;
