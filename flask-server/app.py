import numpy as np
import tensorflow as tf
import os, cv2
from PIL import Image
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow import keras
from io import BytesIO

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React frontend

# Define public GCS URL and local model path
MODEL_URL = "https://storage.googleapis.com/skinlens-models/final_model.keras"
LOCAL_MODEL_PATH = "models/final_model.keras"

# Function to download the model from the public GCS URL
def download_model(local_path):
    if not os.path.exists(local_path):
        print(f"Downloading model from {MODEL_URL}...")
        response = requests.get(MODEL_URL, stream=True)
        if response.status_code == 200:
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            with open(local_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"Model downloaded to {local_path}")
        else:
            raise Exception(f"Failed to download model. HTTP status code: {response.status_code}")

# Ensure the model is downloaded
download_model(LOCAL_MODEL_PATH)

# Load the model
try:
    model = keras.models.load_model(LOCAL_MODEL_PATH)
    print(f"Model loaded successfully from {LOCAL_MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise e

# Define route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    # Parse JSON payload
    data = request.json
    image_url = data.get('imageUrl')

    if not image_url:
        return jsonify({'error': 'No imageUrl provided'}), 400

    try:
        # Fetch the image from the URL
        response = requests.get(image_url)
        if response.status_code != 200:
            return jsonify({'error': f'Failed to fetch image from URL HTTP {response.status_code}'}), 400

        # Load the image into memory
        img = Image.open(BytesIO(response.content))
        img = img.resize((224, 224))  # Resize to match model input
        img = np.array(img) / 255.0  # Normalize pixel values

        # Check if the image is grayscale or RGB
        if len(img.shape) == 2:  # Grayscale image
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
        elif img.shape[2] == 4:  # RGBA image
            img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)

        img = img.reshape(1, 224, 224, 3)  # Reshape for model input

        # Make prediction
        prediction = model.predict(img)
        predicted_class = np.argmax(prediction, axis=1)[0]

        # Mapping of prediction index to disease names
        index = {
            0: 'Acne',
            1: "Actinic Keratoses and Bowen's Disease",
            2: 'Allergic Contact Dermatitis',
            3: 'Basal Cell Carcinoma',
            4: 'Benign Keratosis-like Lesions',
            5: 'Eczema',
            6: 'Folliculitis',
            7: 'Lichen Planus',
            8: 'Lupus Erythematosus',
            9: 'Melanocytic Nevi',
            10: 'Melanoma',
            11: 'Neutrophilic Dermatoses',
            12: 'Photodermatoses',
            13: 'Pityriasis Rosea',
            14: 'Pityriasis Rubra Pilaris',
            15: 'Psoriasis',
            16: 'Sarcoidosis',
            17: 'Scabies',
            18: 'Scleroderma',
            19: 'Squamous cell carcinoma',
            20: 'Urticaria'
        }
        
        # Return the result as JSON
        result = index.get(predicted_class, "Unknown")
        return jsonify({'prediction': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
