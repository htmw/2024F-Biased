import React, { useState } from "react";
import { Upload } from "lucide-react";
import ReportSection from "../components/report/ReportSection";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle file change (selecting file from the file picker)
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        setFile(selectedFile);
        setErrorMessage("");
        setPrediction(""); // Clear previous prediction
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
      } else {
        setErrorMessage(
          "Unsupported file format. Please upload a JPEG or PNG image.",
        );
        setFile(null);
        setPreview(null);
        setPrediction("");
      }
    }
  };

  // Handle file drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile) {
      const fileType = droppedFile.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        setFile(droppedFile);
        setErrorMessage("");
        setPrediction(""); // Clear previous prediction
        const objectUrl = URL.createObjectURL(droppedFile);
        setPreview(objectUrl);
      } else {
        setErrorMessage(
          "Unsupported file format. Please upload a JPEG or PNG image.",
        );
        setFile(null);
        setPreview(null);
        setPrediction("");
      }
    }
  };

  // Mock analysis function
  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage("Please upload an image first.");
      return;
    }

    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock prediction result
      const mockPrediction = {
        condition: "Mild Acne",
        confidence: "89%",
        severity: "Mild",
        recommendations: [
          "Keep the affected area clean",
          "Use non-comedogenic products",
          "Consider over-the-counter treatments",
        ],
      };

      setPrediction(mockPrediction);
      setIsLoading(false);
    }, 2000); // 2 second delay to simulate processing
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-light text-gray-900 mb-8 text-center">
        Upload Your Skin Image
      </h1>
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left side: Upload area */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive ? "border-gray-400 bg-gray-50" : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <div className="mb-6">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto h-32 w-32 object-cover rounded-md"
                />
              ) : (
                <Upload className="mx-auto h-16 w-16 text-gray-400" />
              )}
            </div>
            <p className="text-lg text-gray-700 mb-4">
              {file ? "Image selected" : "Drag and drop your image here"}
            </p>
            <p className="text-sm text-gray-500 mb-6">or</p>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out cursor-pointer"
            >
              Select Image
            </label>
            {file && (
              <p className="mt-4 text-sm text-gray-600 truncate max-w-xs mx-auto">
                {file.name}
              </p>
            )}

            {/* Error message */}
            {errorMessage && (
              <div className="mt-4 text-red-500 text-sm">{errorMessage}</div>
            )}
          </div>

          {/* Analyze button */}
          {file && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Analyzing..." : "Analyze Image"}
            </button>
          )}

          {/* Prediction Result */}
          {prediction && (
            <div className="p-4 bg-green-100 rounded-md">
              <p className="text-lg text-green-700">Analysis Results:</p>
              <div className="mt-2 space-y-2">
                <p className="text-xl font-semibold">{prediction.condition}</p>
                <p className="text-sm text-gray-600">
                  Confidence: {prediction.confidence}
                </p>
                <p className="text-sm text-gray-600">
                  Severity: {prediction.severity}
                </p>
              </div>
            </div>
          )}

          {/* Report Section - Always Visible */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-light text-gray-900 mb-4">
              Skin Analysis Report
            </h3>
            <ReportSection prediction={prediction} />
          </div>
        </div>

        {/* Right side: Upload Instructions */}
        <div className="w-full lg:w-1/2">
          <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-light text-gray-900 mb-6">
              Upload Instructions
            </h2>
            <ul className="space-y-4 text-gray-600">
              <InstructionItem text="Ensure the image is clear and well-lit" />
              <InstructionItem text="Focus on the specific skin area you want analyzed" />
              <InstructionItem text="Remove any accessories or clothing that might obstruct the view" />
              <InstructionItem text="Accepted file formats: JPEG, PNG" />
              <InstructionItem text="Maximum file size: 10MB" />
            </ul>
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm">
                Once you upload an image, our AI will analyze it and provide
                insights about your skin condition. This process is completely
                secure and your privacy is our top priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Instruction item component
const InstructionItem = ({ text }) => (
  <li className="flex items-start">
    <svg
      className="h-6 w-6 text-green-500 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
    <span>{text}</span>
  </li>
);

export default UploadPage;
