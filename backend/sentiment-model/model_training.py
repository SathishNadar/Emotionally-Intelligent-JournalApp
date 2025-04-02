from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset

model_name = "j-hartmann/emotion-english-distilroberta-base"
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model)


my_dataset = load_dataset("Datasets.json")

def tokenize_fn(example):
    return tokenizer(examples["text"], padding="max_length", truncation=True)

tokenized_dataset = my_dataset.map(tokenize_fn, batched=True)

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