from transformers import pipeline

# Load the multilingual emotion model
emotion_analyzer = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

# Example journal entries (English, Hindi, Hinglish)
journals = [
    "that's fire",        
    "You are killing it man" 
]

# Get Predictions
for journal in journals:
    result = emotion_analyzer(journal)
    print(f"Journal: {journal} \nEmotion: {result}\n")