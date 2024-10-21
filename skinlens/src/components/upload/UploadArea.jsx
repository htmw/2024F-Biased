import React from "react";
import { Upload, FileImage } from "lucide-react";

const UploadArea = ({
  file,
  setFile,
  dragActive,
  setDragActive,
  handleFileChange,
}) => {
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    setFile(event.dataTransfer.files[0]);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
        dragActive ? "border-gray-400 bg-gray-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-6">
        {file ? (
          <FileImage className="mx-auto h-16 w-16 text-gray-600" />
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
    </div>
  );
};

export default UploadArea;
