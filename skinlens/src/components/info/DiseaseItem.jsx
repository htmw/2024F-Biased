import React from "react";

const DiseaseItem = ({ name, description }) => (
  <li className="bg-gray-50 rounded-lg p-4 shadow-sm">
    <h3 className="text-lg font-medium text-gray-800 mb-2">{name}</h3>
    <p className="text-gray-600">{description}</p>
  </li>
);

export default DiseaseItem;
