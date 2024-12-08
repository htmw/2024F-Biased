import React, { useState } from "react"; 
import ViewReport from "../report/viewReport";

const RecordsList = ({ cases }) => {
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  if (cases.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No records found.
      </div>
    );
  }

  const getStatusLabel = (status) => {
    if (status === "Reviewed" || status === "reviewed") {
      return { label: "Reviewed", color: "bg-green-100 text-green-800" };
    }
    if (status === "Open") {
      return { label: "Open", color: "bg-yellow-100 text-yellow-800" };
    }
    return { label: "Pending Review", color: "bg-blue-100 text-blue-800" };
  };

  const handleViewReport = (caseId) => {
    setSelectedCaseId(caseId);
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setSelectedCaseId(null);
    setShowReportModal(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Case ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Diagnosis
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cases.map((caseItem) => {
            const { label, color } = getStatusLabel(caseItem.status);
            return (
              <tr
                key={caseItem.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {caseItem.caseId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {caseItem.timestamp
                    ? new Date(caseItem.timestamp).toLocaleString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {caseItem.prediction || "Pending"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}
                  >
                    {label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewReport(caseItem.caseId)}
                    className="text-gray-800 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
                  >
                    View Report
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* View Report Modal */}
      {showReportModal && selectedCaseId && (
        <ViewReport
          caseId={selectedCaseId}
          onClose={closeReportModal}
        />
      )}
    </div>
  );
};

export default RecordsList;

