import React from "react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";

const MainContent = () => (
  <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="text-center">
      <h1 className="text-4xl font-light text-gray-900 sm:text-5xl md:text-6xl">
        <span className="block">Take your Skin Test Now</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        SkinLens uses AI to analyze skin conditions, detect issues, and provide
        personalized recommendations.
      </p>
      <div className="mt-8">
        <Link
          to="/upload"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 md:text-lg transition duration-150 ease-in-out"
        >
          Start Your Test
        </Link>
      </div>
    </div>

    <div className="mt-24">
      <h2 className="text-3xl font-light text-gray-900 text-center">
        How it works
      </h2>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <FeatureCard
          step={1}
          title="Upload Image"
          description="Take a clear photo of your skin concern and securely upload it."
        />
        <FeatureCard
          step={2}
          title="AI Analysis"
          description="Our advanced AI analyzes your image to identify potential skin conditions."
        />
        <FeatureCard
          step={3}
          title="Get Results"
          description="Receive a detailed report with insights and recommendations."
        />
      </div>
    </div>
  </main>
);

export default MainContent;
