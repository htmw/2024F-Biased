import React from "react";
import { X } from "lucide-react";
import MedicalReportTemplate from "./MedicalReportTemplate";

const ReportTemplateModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sampleReportData = {
    reportId: "AI-08-0013908",
    patientInfo: {
      name: "SAMPLE, PATIENT",
      caseNumber: "D-08-0013908",
      demographics: "45 years Female",
      patientId: "PT123456789",
    },
    analysisDate: "2/29/2024 12:01:00 PM",
    generatedDate: "2/29/2024 12:01:00 PM",
    analysis: {
      mainFindings:
        "AI analysis reveals characteristics consistent with mild acne vulgaris. Multiple inflammatory papules are identified with minimal scarring.",
      confidence: "95%",
    },
    examination: {
      location: "Facial region, predominantly in the T-zone",
      characteristics: "Inflammatory papules, few pustules, no nodular lesions",
      additionalFindings:
        "Mild erythema in affected areas, no signs of severe inflammation",
    },
    summary: {
      condition: "Acne Vulgaris",
      severity: "Mild",
      description:
        "The analysis indicates a mild form of acne with primarily inflammatory papules. The distribution pattern and characteristics are typical of common acne vulgaris.",
    },
    recommendations: [
      "Use gentle, non-comedogenic cleansers twice daily",
      "Consider over-the-counter products containing benzoyl peroxide or salicylic acid",
      "Avoid picking or squeezing lesions",
      "Consult with a dermatologist for personalized treatment plan",
      "Follow-up recommended in 4-6 weeks to assess response to treatment",
    ],
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 overflow-auto max-h-[80vh]">
          <MedicalReportTemplate reportData={sampleReportData} />
        </div>
      </div>
    </div>
  );
};

export default ReportTemplateModal;
