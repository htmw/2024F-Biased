import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase-config";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";

const ViewReport = () => {
  const [reportData, setReportData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { caseId } = useParams();

  useEffect(() => {
    const fetchReportByCaseId = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setErrorMessage("Please log in to view reports.");
          return;
        }

        const caseDocRef = doc(db, "cases", caseId);
        const caseDoc = await getDoc(caseDocRef);

        if (caseDoc.exists()) {
          setReportData(caseDoc.data());
          setErrorMessage("");
        } else {
          setErrorMessage("Report not found.");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        setErrorMessage("Failed to fetch report. Please try again later.");
      }
    };

    if (caseId) {
      fetchReportByCaseId();
    }
  }, [caseId]);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  const downloadReport = async () => {
    const element = document.getElementById("report-content");

    if (imagesLoaded) {
      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#FFE4C4",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        const padding = 10;

        pdf.addImage(
          imgData,
          "PNG",
          padding,
          padding,
          pdfWidth - padding * 2,
          pdfHeight,
        );
        pdf.save(`SkinLens_Report_${caseId}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        setErrorMessage("Failed to generate PDF. Please try again.");
      }
    } else {
      setErrorMessage("Please wait for images to load completely.");
    }
  };

  if (errorMessage) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-red-600 text-center">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-gray-600 text-center">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-[#FFE4C4] shadow-lg rounded-md w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 right-4 bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          ×
        </button>

        <div id="report-content" className="print-friendly p-4">
          <h1 className="text-xl font-bold text-[#D2691E] text-center mb-4">
            SKINLENS COMPREHENSIVE ANALYSIS REPORT
          </h1>
          <hr className="border-[#D2691E] border-2" />

          <div className="flex justify-between text-xs mb-3 mt-4">
            <div>
              <p>
                <strong>Patient Name:</strong> {reportData.patientName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {reportData.patientEmail || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <strong>Case #:</strong> {caseId}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(reportData.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <hr className="border-gray-300 my-3" />

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <h2 className="text-md font-semibold text-gray-800 mb-2">
                Uploaded Image
              </h2>
              <img
                src={reportData.imageUrl}
                alt="Uploaded Skin"
                className="w-full h-auto max-h-48 object-cover rounded-md shadow-md"
                onLoad={handleImageLoad}
              />
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-md font-semibold text-gray-800 mb-2">
                AI Analysis
              </h2>
              <p className="text-gray-700 text-sm mb-2">
                AI analysis suggests characteristics consistent with:
              </p>
              {reportData.prediction && (
                <p className="text-[#D2691E] text-md font-bold mb-4">
                  {reportData.prediction}
                </p>
              )}
              <p className="text-gray-700 text-sm">
                {reportData.description || "No description available."}
              </p>
            </div>
          </div>

          <hr className="border-gray-300 my-3" />

          {/* Dermatologist Review Section */}
          {reportData.status === "reviewed" && (
            <div className="mb-4">
              <h2 className="text-md font-semibold text-gray-800 mb-2">
                Dermatologist Review
              </h2>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Comment:
                  </h3>
                  <p className="text-gray-800 mt-1">
                    {reportData.dermDiagnosis}
                  </p>
                </div>
                {/*<div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Treatment Recommendations:
                  </h3>
                  <p className="text-gray-800 mt-1">
                    {reportData.dermRecommendations}
                  </p>
          </div>*/}
                <div className="text-xs text-gray-500 mt-2">
                  Reviewed on:{" "}
                  {new Date(reportData.dermReviewedAt).toLocaleString()}

        </div>
              </div>
          </div>
          )}

          <hr className="border-gray-300 my-3" />

          <div>
            <h2 className="text-md font-semibold text-gray-800 mb-2">
              Treatment recommendations
            </h2>
            <p className="text-gray-700 text-sm">
              {reportData.treatment ||
                "No treatment recommendations available."}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => window.print()}
            className="bg-[#D2691E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#CD853F] transition-colors"
          >
            Print Report
          </button>
          <button
            onClick={downloadReport}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
