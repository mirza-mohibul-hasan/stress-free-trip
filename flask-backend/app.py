from flask import Flask, request, jsonify
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch

# Initialize the Flask app
app = Flask(__name__)

# Load the BLIP processor and model
device = "cuda" if torch.cuda.is_available() else "cpu"
processor = BlipProcessor.from_pretrained(
    "Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained(
    "Salesforce/blip-image-captioning-base").to(device)


@app.route('/caption', methods=['POST'])
def caption_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file uploaded"}), 400

    # Open the uploaded image
    image = Image.open(request.files['image']).convert("RGB")

    # Process the image and generate caption
    inputs = processor(images=image, return_tensors="pt").to(device)
    output = model.generate(**inputs)
    caption = processor.decode(output[0], skip_special_tokens=True)

    # Return the generated caption
    return jsonify({"caption": caption})


# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
