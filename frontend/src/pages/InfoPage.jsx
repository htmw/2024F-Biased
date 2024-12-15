import React from "react";

const diseases = [
  { id: 0, name: "Acne", description: "A common skin condition causing pimples and inflammation." },
  { id: 1, name: "Actinic Keratoses and Bowen's Disease", description: "Pre-cancerous growths caused by sun damage." },
  { id: 2, name: "Allergic Contact Dermatitis", description: "Skin inflammation caused by allergens." },
  { id: 3, name: "Basal Cell Carcinoma", description: "A common form of skin cancer that rarely spreads." },
  { id: 4, name: "Benign Keratosis-like Lesions", description: "Non-cancerous growths on the skin." },
  { id: 5, name: "Eczema", description: "A condition causing itchy, inflamed skin." },
  { id: 6, name: "Folliculitis", description: "Inflammation or infection of hair follicles." },
  { id: 7, name: "Lichen Planus", description: "A condition causing swelling and irritation in the skin and mucous membranes." },
  { id: 8, name: "Lupus Erythematosus", description: "An autoimmune disease affecting the skin." },
  { id: 9, name: "Melanocytic Nevi", description: "Common moles that are typically benign." },
  { id: 10, name: "Melanoma", description: "A serious form of skin cancer." },
  { id: 11, name: "Neutrophilic Dermatoses", description: "A group of disorders causing skin inflammation." },
  { id: 12, name: "Photodermatoses", description: "Skin reactions caused by sunlight." },
  { id: 13, name: "Pityriasis Rosea", description: "A skin rash that usually resolves on its own." },
  { id: 14, name: "Pityriasis Rubra Pilaris", description: "A rare skin disorder causing redness and scaling." },
  { id: 15, name: "Psoriasis", description: "An autoimmune condition causing scaly skin patches." },
  { id: 16, name: "Sarcoidosis", description: "An inflammatory disease affecting multiple organs, including the skin." },
  { id: 17, name: "Scabies", description: "A contagious skin infestation by mites." },
  { id: 18, name: "Scleroderma", description: "A condition causing thickening and hardening of the skin." },
  { id: 19, name: "Squamous Cell Carcinoma", description: "A common form of skin cancer." },
  { id: 20, name: "Urticaria", description: "Also known as hives, causing itchy welts on the skin." },
];

const InfoPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Diseases Identified by SkinLens</h1>
      <p className="text-gray-600 mb-6">
        SkinLens can identify a range of skin conditions. Below is a list of diseases our app supports,
        along with a brief description:
      </p>
      <ul className="space-y-4">
        {diseases.map((disease) => (
          <li key={disease.id} className="p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700">{disease.name}</h2>
            <p className="text-gray-600">{disease.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfoPage;
