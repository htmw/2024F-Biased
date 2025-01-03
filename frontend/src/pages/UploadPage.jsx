import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { auth, db } from "../firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, setDoc,getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import ViewReport from "../components/report/viewReport";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [prediction, setPrediction] = useState("");
  const [description, setDescription] = useState("");
  const [treatment, setTreatment] = useState("");
  const [user, setUser] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hideUploadSection, setHideUploadSection] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);
  const [caseId, setCaseId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);

  // Set user information on mount
  useEffect(() => {
    
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            name: userData.name || "Unknown Patient",
          });
        } else {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
          });
        }
      }
    };
    fetchUserData();
  }, []);
  

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        setFile(selectedFile);
        setErrorMessage("");
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setErrorMessage("Unsupported file format. Please upload a JPEG or PNG image.");
        setFile(null);
        setPreview(null);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      const fileType = droppedFile.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        setFile(droppedFile);
        setErrorMessage("");
        setPreview(URL.createObjectURL(droppedFile));
      } else {
        setErrorMessage("Unsupported file format. Please upload a JPEG or PNG image.");
        setFile(null);
        setPreview(null);
      }
    }
  };

  
  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage("Please upload an image.");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
  
    const storage = getStorage();
    const newCaseId = uuidv4();
    const storagePath = user
      ? `cases/${user.uid}/${newCaseId}/${file.name}`
      : `temp/${newCaseId}/${file.name}`;
    const storageRef = ref(storage, storagePath);
  
    try {
      // Upload file
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      let newCaseId = "SKIN-1";
      const casesRef = collection(db, "cases");
      const casesSnapshot = await getDocs(casesRef);

      if (!casesSnapshot.empty) {
        const caseIds = casesSnapshot.docs
          .map((doc) => doc.data().caseId)
          .filter((id) => id.startsWith("SKIN-"))
          .map((id) => parseInt(id.split("-")[1], 10))
          .filter((num) => !isNaN(num));
        const maxId = Math.max(0, ...caseIds);
        newCaseId = `SKIN-${maxId + 1}`;
      }
  
      // Add document to Firestore for logged-in users using `setDoc()` with `newCaseId` as the document ID
      if (user) {
        const caseDocRef = doc(collection(db, "cases"), newCaseId);
        await setDoc(caseDocRef, {
          caseId: newCaseId,
          patientId: user.uid,
          patientEmail: user.email,
          patientName: user.name,
          imageUrl: downloadURL,
          timestamp: new Date().toISOString(),
          status:"Open",
        });
      }
  
      setCaseId(newCaseId);
      setImageUrl(downloadURL);
      setUploadMessage(
        user
          ? "Image uploaded successfully! Ready for prediction."
          : "Image uploaded temporarily! Ready for prediction."
      );
      setTimeout(() => setUploadMessage(""), 2000);
      setErrorMessage("");
      setShowInstructions(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Error uploading the image. Please try again.");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };
  

  const handlePredict = async () => {
    if (!imageUrl) {
      alert("No image URL available for prediction.");
      return;
    }
  
    try {
      // Make the prediction request to the backend
      const response = await axios.post("http://localhost:5000/predict", { imageUrl });
      if (response.data && response.data.prediction) {
        const predictedDisease = response.data.prediction;
        setPrediction(predictedDisease);
  
        // Fetch description and treatment for the predicted disease
        let fetchedDescription = "No description available.";
        let fetchedTreatment = "No treatment recommendations available.";
  
        const diseasesRef = collection(db, "diseases");
        const q = query(diseasesRef, where("disease", "==", predictedDisease));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const diseaseDoc = querySnapshot.docs[0].data();
          fetchedDescription = diseaseDoc.description || fetchedDescription;
          fetchedTreatment = diseaseDoc.treatment || fetchedTreatment;
        }
  
        setDescription(fetchedDescription);
        setTreatment(fetchedTreatment);
  
        // Update the Firestore document for the current case with prediction results
        if (caseId) {
          const caseDocRef = doc(collection(db, "cases"), caseId);
          await setDoc(caseDocRef, {
            prediction: predictedDisease,
            description: fetchedDescription,
            treatment: fetchedTreatment,
            status:"Pending Review"
          }, { merge: true }); // Merge to avoid overwriting other fields
        }
      } else {
        alert("Failed to get prediction. Please try again.");
      }
  
      setHideUploadSection(true);
      setHideButtons(true);
      setPreview(null);
      setHideTitle(true);
      
  
      // For non-authenticated users, delete the temporary image after use
      if (!user) {
        setTimeout(async () => {
          try {
            const storage = getStorage();
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
            console.log("Temporary image deleted after use.");
          } catch (error) {
            console.error("Error deleting temporary image:", error);
          }
        }, 5000);
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };
  const handleRetake = () => {
    setFile(null);
    setPreview(null);
    setUploadMessage("");
    setErrorMessage("");
    setImageUrl("");
    setPrediction("");
    setDescription("");
    setTreatment("");
    setShowInstructions(true);
    setHideUploadSection(false);
    setHideButtons(false);
    setHideTitle(false);
  };
  
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Display Success and Error Messages */}
      <div className="mb-4">
        {uploadMessage && (
          <div className="p-4 mb-2 bg-green-100 border border-green-600 text-green-800 rounded-lg text-center shadow-md">
            {uploadMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 mb-2 bg-red-100 border border-red-600 text-red-800 rounded-lg text-center shadow-md">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && caseId && (
        <ViewReport caseId={caseId} onClose={() => setShowModal(false)} />
      )}

      {!hideTitle && (
        <h1 className="text-3xl font-light text-gray-900 mb-8 text-center">
          Upload Your Skin Image
        </h1>
      )}

      <div
        className="flex flex-col lg:flex-row gap-12"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
      {!hideUploadSection && !prediction && (
        <div className="w-full lg:w-1/2">
          <div className="border-2 border-dashed rounded-xl p-12 text-center shadow-md hover:shadow-lg transition-shadow bg-gray-50/20">
            {preview && !hideUploadSection ? (
              <img
                src={preview}
                alt="Preview"
                className="mx-auto h-60 w-60 object-cover rounded-lg shadow-lg border-4 border-gray-200"
              />
            ) : (
              <Upload className="mx-auto h-16 w-16 text-gray-400" />
            )}
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="mt-6 inline-block bg-gray-800 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all shadow-lg"
            >
              Select Image
            </label>
          </div>

          {!hideButtons && !prediction && (
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={handleSubmit}
                className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all shadow-lg"
              >
                Upload Image
              </button>

              {imageUrl && (
                <button
                  onClick={handlePredict}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-500 transition-all shadow-lg"
                >
                  Predict Diagnosis
                </button>
              )}
            </div>
          )}
        </div>
      )}

         {showInstructions && (
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
            </div>
          </div>
        )}
      </div>

      {prediction && (
        <div className="mt-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Prediction Card! */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 flex-1">
            <div className="bg-gray-100 p-4">
              <h3 className="text-lg font-medium text-gray-800 text-center">Prediction Result</h3>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-4">
                <img
                  src={imageUrl}
                  alt="Uploaded Skin Image"
                  className="h-48 w-48 object-cover rounded-md shadow-md"
                />
              </div>
              <p className="text-center text-xl font-semibold text-blue-700">{prediction}</p>
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleRetake}
                  className="bg-gray-800 text-white px-8 py-3 rounded-lg shadow-md hover:bg-gray-700 transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Retake Test
                </button>
              </div>
              </div>
          </div>
          
          {/* Description and Treatment Recommendations */}
          {user && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 flex-1">
              <h4 className="text-lg font-medium text-gray-800">Description</h4>
              <p className="text-gray-700 mt-2">
                {description || "Loading description..."}
              </p>
              <h4 className="text-lg font-medium text-gray-800 mt-4">Treatment Recommendations</h4>
              <p className="text-gray-700 mt-2">
                {treatment || "Loading treatment recommendations..."}
              </p>

              {/* View Report and Download Report Buttons */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all shadow-lg"
                  onClick={() => setShowModal(true)}
                >
                  View Report
                </button>
                {/* <button
                  className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all shadow-lg"
                  onClick={() => alert("Download Report functionality coming soon!")}
                >
                  Download Report
                </button> */}
              </div>
            </div>
          )}
          {!user && (
            <p className="text-red-600 mt-4 text-center flex-1">
              Log in to view detailed diagnosis description and treatment recommendations.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Helper component for displaying instructions
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