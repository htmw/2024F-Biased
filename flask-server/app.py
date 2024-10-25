import numpy as np
import tensorflow as tf
import os, cv2
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow import keras

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React frontend

# Load pre-trained model
model = keras.models.load_model("models/skinlensAI.keras")

# Define route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    # Get the uploaded image
    f = request.files['image']
    
    # Save the file temporarily
    basepath = os.path.dirname(__file__)
    filepath = os.path.join(basepath, 'uploads', f.filename)
    f.save(filepath)
    
    # Process the image for the model
    img = cv2.imread(filepath)
    img = cv2.resize(img, (150, 150))  # Resizing image to match model input
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

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
