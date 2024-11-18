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

# Load pre-trained model
model = keras.models.load_model("models/skinlensAI.keras")

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
            return jsonify({'error': 'Failed to fetch image from URL'}), 400

        # Load the image into memory
        img = Image.open(BytesIO(response.content))
        img = img.resize((150, 150))  # Resize to match model input
        img = np.array(img)  # Convert image to numpy array

        # Check if the image is grayscale or RGB
        if len(img.shape) == 2:  # Grayscale image
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
        elif img.shape[2] == 4:  # RGBA image
            img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)

        img = img.reshape(1, 150, 150, 3)  # Reshape for model input

        # Make prediction
        prediction = model.predict(img)
        predicted_class = np.argmax(prediction, axis=1)[0]

        # Mapping of prediction index to disease names
        index = [
            'Actinic Keratosis',
            'Dermatofibroma',
            'Melanoma',
            'Seborrheic Keratosis',
            'Squamous Cell Carcinoma',
            "Acne and Rosacea",
            "Eczema",
            "Tinea (Ringworm)"
        ]
        
        # Return the result as JSON
        result = index[predicted_class]
        return jsonify({'prediction': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
