import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import ReportStepper from "./ReportStepper"; // stepper form
import { useReports } from "../contexts/ReportContext";

const CreateReportModal = ({ isOpen, onClose, reportToEdit }) => {
  const { createReport, updateReport } = useReports();
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (reportData) => {
    try {
      if (reportToEdit) {
        await updateReport(reportToEdit.id, reportData);
      } else {
        await createReport(reportData); // should send FormData with mediaFile
      }

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error saving report:", err);
      alert("Failed to submit report. Please try again.");
    }
  };

  // Success screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your report has been successfully submitted and is now under review.
          </p>
          <div className="w-12 h-1 bg-green-500 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  // Form modal
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

        <ReportStepper
          reportToEdit={reportToEdit}
          handleSubmit={handleSave}
        />
      </div>
    </div>
  );
};

export default CreateReportModal;
