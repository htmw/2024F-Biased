import React from "react";

const InfoPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-light text-gray-900 mb-8 text-center">
        Understanding Skin Diseases
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          What are Skin Diseases?
        </h2>
        <p className="text-gray-600 mb-4">
          Skin diseases are conditions that affect the skin, which is the
          largest organ of the body. These conditions can range from minor
          irritations to severe disorders that impact a person's quality of
          life. Skin diseases can be caused by various factors, including
          genetics, infections, allergies, and environmental influences.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          Common Skin Diseases
        </h2>
        <ul className="space-y-4">
          {commonSkinDiseases.map((disease, index) => (
            <DiseaseItem key={index} {...disease} />
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          When to See a Dermatologist
        </h2>
        <p className="text-gray-600 mb-4">
          While many skin conditions can be managed with over-the-counter
          treatments, it's important to consult a dermatologist if you
          experience:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Persistent skin issues that don't respond to home treatments</li>
          <li>Sudden or severe skin changes</li>
          <li>Skin growths or moles that change in size, shape, or color</li>
          <li>Skin conditions that affect your daily life or self-esteem</li>
          <li>Any concerns about your skin health</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          Maintaining Healthy Skin
        </h2>
        <p className="text-gray-600 mb-4">
          Proper skin care can help prevent many skin diseases and maintain
          overall skin health. Here are some tips:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            Protect your skin from sun damage by using sunscreen and wearing
            protective clothing
          </li>
          <li>Keep your skin clean and moisturized</li>
          <li>Stay hydrated by drinking plenty of water</li>
          <li>Eat a balanced diet rich in vitamins and antioxidants</li>
          <li>Manage stress through relaxation techniques or exercise</li>
          <li>Avoid smoking and limit alcohol consumption</li>
        </ul>
      </section>
    </div>
  );
};

const DiseaseItem = ({ name, description }) => (
  <li className="bg-gray-50 rounded-lg p-4 shadow-sm">
    <h3 className="text-lg font-medium text-gray-800 mb-2">{name}</h3>
    <p className="text-gray-600">{description}</p>
  </li>
);

const commonSkinDiseases = [
  {
    name: "Acne",
    description:
      "A common condition characterized by whiteheads, blackheads, and inflamed red pimples. It typically occurs during puberty but can affect people of all ages.",
  },
  {
    name: "Eczema (Atopic Dermatitis)",
    description:
      "A chronic condition causing dry, itchy, and inflamed skin. It often appears in patches on the hands, feet, ankles, neck, upper body, and limbs.",
  },
  {
    name: "Psoriasis",
    description:
      "An autoimmune condition resulting in the rapid buildup of skin cells, forming scales and red patches that can be itchy and painful.",
  },
  {
    name: "Rosacea",
    description:
      "A common skin condition causing redness and visible blood vessels in the face. It may also produce small, red, pus-filled bumps.",
  },
  {
    name: "Skin Cancer",
    description:
      "Abnormal growth of skin cells, most often developing on skin exposed to the sun. The three main types are basal cell carcinoma, squamous cell carcinoma, and melanoma.",
  },
];

export default InfoPage;
