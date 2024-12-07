import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase-config";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import DermActionModal from "./DermActionModal";

const DermDashboard = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAttribute, setFilterAttribute] = useState("patientName");
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      const casesRef = collection(db, "cases");
      const casesSnapshot = await getDocs(casesRef);

      const casesData = casesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCases(casesData);
      setFilteredCases(casesData);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load dashboard data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUserAndFetchCases = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        // Verify dermatologist role
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || userDoc.data().role !== "dermatologist") {
          navigate("/");
          return;
        }

        fetchCases();
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    checkUserAndFetchCases();
  }, [navigate]);

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredCases].sort((a, b) => {
      const valueA = (a[key] || "").toString().toLowerCase();
      const valueB = (b[key] || "").toString().toLowerCase();

      if (key === "timestamp") {
        return direction === "asc"
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }

      return direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    setFilteredCases(sortedData);
  };

  useEffect(() => {
    const filtered = cases.filter((caseItem) => {
      const searchValue = String(caseItem[filterAttribute] || "").toLowerCase();
      return searchValue.includes(searchTerm.toLowerCase());
    });

    const sortedFiltered = [...filtered].sort((a, b) => {
      const valueA = (a[sortConfig.key] || "").toString().toLowerCase();
      const valueB = (b[sortConfig.key] || "").toString().toLowerCase();

      if (sortConfig.key === "timestamp") {
        return sortConfig.direction === "asc"
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }

      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    setFilteredCases(sortedFiltered);
  }, [searchTerm, filterAttribute, cases, sortConfig]);

  const handleViewReport = (caseId) => {
    navigate(`/report/${caseId}`);
  };

  const handleTakeAction = (caseItem) => {
    setSelectedCase(caseItem);
    setShowActionModal(true);
  };

  const handleReviewSuccess = () => {
    fetchCases();
  };

  const TableHeader = ({ label, sortKey }) => {
    const isSorted = sortConfig.key === sortKey;
    return (
      <th
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => sortData(sortKey)}
      >
        <div className="flex items-center space-x-1">
          <span>{label}</span>
          <div className="flex flex-col">
            {isSorted && sortConfig.direction === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : isSorted && sortConfig.direction === "desc" ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4" />
            )}
          </div>
        </div>
      </th>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-6">
          Dermatologist Dashboard
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={filterAttribute}
            onChange={(e) => setFilterAttribute(e.target.value)}
          >
            <option value="patientName">Patient Name</option>
            <option value="patientEmail">Patient Email</option>
            <option value="prediction">Diagnosis</option>
            <option value="caseId">Case ID</option>
          </select>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader label="Case ID" sortKey="caseId" />
                  <TableHeader label="Patient Name" sortKey="patientName" />
                  <TableHeader label="Date" sortKey="timestamp" />
                  <TableHeader label="Diagnosis" sortKey="prediction" />
                  <TableHeader label="Status" sortKey="status" />
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCases.length > 0 ? (
                  filteredCases.map((caseItem) => (
                    <tr
                      key={caseItem.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {caseItem.caseId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {caseItem.patientName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {caseItem.patientEmail || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {caseItem.timestamp
                          ? new Date(caseItem.timestamp).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {caseItem.prediction || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            caseItem.status === "reviewed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {caseItem.status === "reviewed"
                            ? "Reviewed"
                            : "Pending Review"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewReport(caseItem.id)}
                            className="text-gray-800 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
                          >
                            View Report
                          </button>
                          <button
                            onClick={() => handleTakeAction(caseItem)}
                            className={`px-3 py-2 rounded-md transition-colors ${
                              caseItem.status === "reviewed"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            }`}
                          >
                            {caseItem.status === "reviewed"
                              ? "Update Review"
                              : "Take Action"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No cases found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showActionModal && (
        <DermActionModal
          caseId={selectedCase.id}
          currentCase={selectedCase}
          onClose={() => setShowActionModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default DermDashboard;
