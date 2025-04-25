from flask import Flask, request, jsonify
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# model_path = "./fine-tuned-emotion-model"  
model_path = "j-hartmann/emotion-english-distilroberta-base"   
 
model = AutoModelForSequenceClassification.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

# emotion_analyzer = pipeline("text-classification", model=model_path, tokenizer=tokenizer)
emotion_analyzer = pipeline("text-classification", model=model, tokenizer=tokenizer)
print(model.config.id2label)  
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

# from transformers import AutoConfig

# config = AutoConfig.from_pretrained("j-hartmann/emotion-english-distilroberta-base")
# print(config.id2label)  # Should match your expected labels
# print(config.label2id)  # Should match your label encoding