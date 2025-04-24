#pip install transformers datasets torch huggingface_hub
#HOW TO TRAIN YOUR MODEL
from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset
from huggingface_hub import login

from huggingface_hub import login
login()

from huggingface_hub import whoami
print(whoami())

HF_TOKEN = "HUGGING_FACE_KEY"  # Replace with your token
login(HF_TOKEN)

#Loading the pretrained model
model_name = "j-hartmann/emotion-english-distilroberta-base"
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

#Loading the Dataset
my_dataset = load_dataset("json", data_files="/content/Datasets.json")
split_dataset = my_dataset["train"].train_test_split(test_size=0.2)

#Label Mapping and Encoding
label_mapping = {
    "joy 😀": 0,
    "sadness 😭": 1,
    "anger 🤬": 2,
    "fear 😨": 3,
    "disgust 🤢": 4,
    "surprise 😲": 5,
    "neutral 😐": 6
}

def encode_labels(example):
    example["label"] = label_mapping[example["label"]]  # Convert label to integer
    return example

split_dataset = split_dataset.map(encode_labels)

#Tokenization
def tokenize_fn(example):
    return tokenizer(example["text"], padding="max_length", truncation=True)

tokenized_dataset = split_dataset.map(tokenize_fn, batched=True)

# Define training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir="./logs",
)

#Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["test"],
)

# Train model
trainer.train()

# Save fine-tuned model
model.save_pretrained("./fine-tuned-emotion-model")
tokenizer.save_pretrained("./fine-tuned-emotion-model")