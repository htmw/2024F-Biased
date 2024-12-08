import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db,auth } from "../../firebase-config";

const DermActionModal = ({ caseId, currentCase, onClose, onSuccess }) => {
  const [diagnosis, setDiagnosis] = useState(currentCase?.dermDiagnosis || "");
  const [prediction, setPrediction] = useState(currentCase?.prediction || "Loading...");
  const [description, setDescription] = useState(currentCase?.description || "Loading...");
  const [treatment, setTreatment] = useState(currentCase?.treatment || "Loading...");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchCaseData = async () => {
      if (!caseId) {
        setError("Invalid case ID. Cannot load case details.");
        return;
      }

      try {
        const caseRef = doc(db, "cases", caseId);
        const caseSnap = await getDoc(caseRef);

        if (caseSnap.exists()) {
          const caseData = caseSnap.data();
          setPrediction(caseData.prediction || "Unknown Disease");
          setDescription(caseData.description || "No description available.");
          setTreatment(caseData.treatment || "No treatment recommendations available.");
        } else {
          setError("Case not found.");
        }
      } catch (err) {
        console.error("Error fetching case data:", err);
        setError("Failed to load case details. Please try again.");
      }
    };

    fetchCaseData();
  }, [caseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser; // Get the current authenticated user
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      // Fetch dermatologist name from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const dermatologistName = userDoc.exists() ? userDoc.data().name || "Unknown" : "Unknown";

      const caseRef = doc(db, "cases", caseId);
      await updateDoc(caseRef, {
        dermDiagnosis: diagnosis,
        dermReviewedAt: new Date().toISOString(),
        status: "reviewed",
        reviewedBy: dermatologistName,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating case:", err);
      setError("Failed to update case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="p-6">
          <h1
            className="text-2xl font-bold text-white-900 mb-4 p-3 rounded-md"
            style={{ backgroundColor: "#FFE4C4" }}
          >
            Dermatologist Review
          </h1>
          <hr className="mb-4" />

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Details</h2>

          <form onSubmit={handleSubmit}>
            {/* AI Diagnosis Section */}
            <div className="mb-6">
              <label
                htmlFor="prediction"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                AI Diagnosis
              </label>
              <p
                id="prediction"
                className="text-gray-700 bg-gray-100 p-3 rounded-md"
              >
                {prediction}
              </p>
            </div>

            {/* Description Section */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Description
              </label>
              <p
                id="description"
                className="text-gray-700 bg-gray-100 p-3 rounded-md"
              >
                {description}
              </p>
            </div>

            {/* Treatment Recommendations Section */}
            <div className="mb-6">
              <label
                htmlFor="treatment"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Treatment Recommendations
              </label>
              <p
                id="treatment"
                className="text-gray-700 bg-gray-100 p-3 rounded-md"
              >
                {treatment}
              </p>
            </div>

            <hr className="mb-4" />

            {/* Comment Section */}
            <div className="mb-6">
              <label
                htmlFor="diagnosis"
                className="text-lg font-semibold text-gray-800 mb-4 p-3 rounded-md flex items-center"
                style={{
                  backgroundColor: "#FFFAF0",
                  border: "2px solid #FFD700",
                }}
              >
                Add Comment
              </label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-gray-50 p-3"
                rows={3}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter your professional diagnosis"
                required
              />
            </div>

            {/* Error Message */}
            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DermActionModal;
