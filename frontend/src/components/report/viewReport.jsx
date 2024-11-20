import React, { useEffect, useState } from "react";
import { query, where, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewReport = ({ caseId, onClose }) => {
  const [reportData, setReportData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchReportByCaseId = async () => {
      try {
        const q = query(collection(db, "cases"), where("caseId", "==", caseId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setReportData(doc.data());
          });
        } else {
          setErrorMessage("Report not found.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch report. Please try again later.");
      }
    };

    fetchReportByCaseId();
  }, [caseId]);

  // Callback to set imagesLoaded when all images are loaded
  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  const downloadReport = async () => {
    const element = document.getElementById("report-content"); // Target element for the report

    if (imagesLoaded) {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true, // Allow cross-origin resources
        backgroundColor: "#FFE4C4", // To maintain background consistency
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const padding = 10; // Padding for the content in the PDF

      pdf.addImage(imgData, "PNG", padding, padding, pdfWidth - padding * 2, pdfHeight);
      pdf.save(`SkinLens_Report_${caseId}.pdf`);
    } else {
      console.log("Images are still loading, please wait...");
    }
  };

  if (errorMessage) {
    return <div className="text-red-600 text-center">{errorMessage}</div>;
  }

  if (!reportData) {
    return <div className="text-gray-600 text-center">Loading report...</div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#FFE4C4] shadow-lg rounded-md w-full max-w-xl p-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center"
        >
          &times;
        </button>

        {/* Report Content */}
        <div id="report-content" className="print-friendly p-4">
          <h1 className="text-xl font-bold text-[#D2691E] text-center mb-4">
            SKINLENS AI ANALYSIS REPORT
          </h1>
          <hr className="border-[#D2691E] border-2" />
          <br />
          <div className="flex justify-between text-xs mb-3">
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

          {/* AI Analysis Section */}
          <div className="mb-4">
            <h2 className="text-md font-semibold text-gray-800">AI Analysis</h2>
            <p className="text-gray-700 mt-1 text-sm">
              AI analysis reveals characteristics consistent with the following condition:
            </p>
            {reportData.prediction && (
              <p className="text-[#D2691E] text-md font-bold mt-2">
                {reportData.prediction}
              </p>
            )}
          </div>
          <hr className="border-gray-300 my-3" />

          {/* Uploaded Image */}
          <div className="flex items-start mb-4">
            <div className="w-1/3">
              <h2 className="text-md font-semibold text-gray-800">
                Uploaded Image
              </h2>
              <img
                src={reportData.imageUrl}
                alt="Uploaded Skin"
                className="w-36 h-36 object-cover rounded-md shadow-md mt-2"
                onLoad={handleImageLoad}
              />
            </div>
            <div className="w-2/3 pl-4">
              <h2 className="text-md font-semibold text-gray-800 mb-1">
                Condition Description
              </h2>
              <p className="text-gray-700 text-sm">
                {reportData.description || "N/A"}
              </p>
            </div>
          </div>
          <hr className="border-gray-300 my-3" />

          {/* Treatment Recommendations */}
          <div>
            <h2 className="text-md font-semibold text-gray-800">
              Recommended Treatments
            </h2>
            <p className="text-gray-700 mt-1 text-sm">
              {reportData.treatment || "N/A"}
            </p>
          </div>
          <hr className="border-gray-300 my-3" />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => window.print()}
            className="bg-[#D2691E] text-white px-4 py-1 rounded-lg text-sm hover:bg-[#CD853F] transition-all"
          >
            Print Report
          </button>
          <button
            onClick={downloadReport}
            className="bg-gray-800 text-white px-4 py-1 rounded-lg text-sm hover:bg-gray-700 transition-all"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
