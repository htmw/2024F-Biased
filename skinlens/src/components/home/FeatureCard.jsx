import React from "react";

const FeatureCard = ({ step, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-800 mb-4">
      {step}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-base text-gray-500">{description}</p>
  </div>
);

export default FeatureCard;
