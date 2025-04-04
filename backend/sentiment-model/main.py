from flask import Flask, request, jsonify
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

model_path = "./fine-tuned-emotion-model"  

model = AutoModelForSequenceClassification.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

emotion_analyzer = pipeline("text-classification", model=model_path, tokenizer=tokenizer)

@app.route("/analyze_emotion", methods=["POST"])
def analyze_emotion():
    data = request.json  # Get text from frontend
    user_text = data.get("text", "")

    if not user_text:
        return jsonify({"error": "No text provided"}), 400

    result = emotion_analyzer(user_text)
    return jsonify({"text": user_text, "emotion": result})

if __name__ == "__main__":
    app.run(debug=True)