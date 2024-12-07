import React, { useState, useEffect } from "react";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

const DermActionModal = ({ caseId, currentCase, onClose, onSuccess }) => {
  const [diagnosis, setDiagnosis] = useState(currentCase?.dermDiagnosis || "");
  const [recommendations, setRecommendations] = useState(
    currentCase?.dermRecommendations || "",
  );
  const [selectedDisease, setSelectedDisease] = useState(
    currentCase?.prediction || "",
  );
  const [diseases, setDiseases] = useState([]);
  const [description, setDescription] = useState(
    currentCase?.description || "",
  );
  const [treatment, setTreatment] = useState(currentCase?.treatment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const diseasesRef = collection(db, "diseases");
        const snapshot = await getDocs(diseasesRef);
        const diseasesData = snapshot.docs.map((doc) => doc.data());
        setDiseases(diseasesData);

        if (selectedDisease) {
          const selectedDiseaseData = diseasesData.find(
            (d) => d.disease === selectedDisease,
          );
          if (selectedDiseaseData) {
            setDescription(selectedDiseaseData.description);
            setTreatment(selectedDiseaseData.treatment);
          }
        }
      } catch (error) {
        console.error("Error fetching diseases:", error);
        setError("Failed to load diseases list");
      }
    };

    fetchDiseases();
  }, [selectedDisease]);

  const handleDiseaseChange = (e) => {
    const newDisease = e.target.value;
    setSelectedDisease(newDisease);

    const diseaseData = diseases.find((d) => d.disease === newDisease);
    if (diseaseData) {
      setDescription(diseaseData.description);
      setTreatment(diseaseData.treatment);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const caseRef = doc(db, "cases", caseId);
      await updateDoc(caseRef, {
        dermDiagnosis: diagnosis,
        dermRecommendations: recommendations,
        dermReviewedAt: new Date().toISOString(),
        status: "reviewed",
        prediction: selectedDisease,
        description: description,
        treatment: treatment,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating case:", error);
      setError("Failed to update case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Dermatologist Review
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="disease"
                className="block text-sm font-medium text-gray-700"
              >
                Disease Name
              </label>
              <select
                id="disease"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                value={selectedDisease}
                onChange={handleDiseaseChange}
                required
              >
                <option value="">Select Disease</option>
                {diseases.map((disease, index) => (
                  <option key={index} value={disease.disease}>
                    {disease.disease}
                  </option>
                ))}
              </select>
            </div>

            {/*<div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Disease Description
              </label>
              <textarea
                id="description"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
                </div>*/}

            {/*<div>
              <label
                htmlFor="treatment"
                className="block text-sm font-medium text-gray-700"
              >
                General Treatment Guidelines
              </label>
              <textarea
                id="treatment"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                rows={3}
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                required
              />
              </div>*/}

            <div>
              <label
                htmlFor="diagnosis"
                className="block text-sm font-medium text-gray-700"
              >
                Comment
              </label>
              <textarea
                id="diagnosis"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                rows={3}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter your professional diagnosis"
                required
              />
            </div>

            {/*<div>
              <label
                htmlFor="recommendations"
                className="block text-sm font-medium text-gray-700"
              >
                Treatment Recommendations
              </label>
              <textarea
                id="recommendations"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                rows={4}
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                placeholder="Enter your treatment recommendations"
                required
              />
            </div>*/}

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex justify-end space-x-3 mt-6">
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
