import React from "react";
import { X } from "lucide-react";
import ReportStepper from "./ReportStepper"; // stepper form
import { useReports } from "../contexts/ReportContext";
import { toast } from "react-hot-toast"; // <- import toaster

const CreateReportModal = ({ isOpen, onClose, reportToEdit }) => {
  const { createReport, updateReport } = useReports();

  if (!isOpen) return null;

  const handleSave = async (reportData) => {
    try {
      if (reportToEdit) {
        await updateReport(reportToEdit.id, reportData);
        toast.success("Report updated successfully!");
      } else {
        await createReport(reportData); // should send FormData with mediaFile
        toast.success("Report submitted successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Error saving report:", err);
      toast.error("Failed to submit report. Please try again.");
    }
  };

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
