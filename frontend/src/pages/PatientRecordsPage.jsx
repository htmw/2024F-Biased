import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import RecordsList from "../components/records/RecordsList";

const PatientRecordsPage = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("User not authenticated");
        }

        const casesRef = collection(db, "cases");
        const casesSnapshot = await getDocs(casesRef);

        const userCases = casesSnapshot.docs
          .filter((doc) => doc.data().patientId === user.uid) // Only fetch cases for the logged-in patient
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setCases(userCases);
        setFilteredCases(userCases);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cases:", error);
        setError("Failed to load records. Please try again later.");
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredCases].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
  
      if (key === "timestamp") {
        // Handle date sorting
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }
  
      // Handle string comparison for other keys
      return direction === "asc"
        ? String(valueA || "").localeCompare(String(valueB || ""))
        : String(valueB || "").localeCompare(String(valueA || ""));
    });
  
    setFilteredCases(sortedData);
  };

  useEffect(() => {
    const filtered = cases.filter((caseItem) => {
      const matchesSearch =
        caseItem.caseId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        caseItem.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    setFilteredCases(filtered);
  }, [searchTerm, statusFilter, cases]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading records...</div>
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
      <h1 className="text-3xl font-light text-gray-900 mb-6">My Records</h1>

      {/* Search, Sort, and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Case ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sort Button */}
        <button
          onClick={() => sortData("timestamp")}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
        >
          Sort by Date{" "}
          {sortConfig.key === "timestamp" &&
            (sortConfig.direction === "asc" ? (
              <ChevronUp className="h-4 w-4 inline" />
            ) : (
              <ChevronDown className="h-4 w-4 inline" />
            ))}
        </button>

        {/* Status Filter */}
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Open">Open</option>
          <option value="Pending Review">Pending Review</option>
        </select>
      </div>

      {/* Records List */}
      <RecordsList cases={filteredCases} />
    </div>
  );
};

export default PatientRecordsPage;


