import requests
import json

OPENROUTER_API_KEY = "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"
MODEL_NAME = "google/gemma-7b-it:free"
MAX_TOKENS = 8192
TEXT_INPUT=2024-05-23-textdata.txt

response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {OPENROUTER_API_KEY}"
    },
    data=json.dumps({
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": f"Make the {TEXT_INPUT} to diary."}
        ]
    })
)

# Check if the request was successful
if response.status_code == 200:
    # Extract the "Answer" part from the response
    response_json = response.json()
    answer = response_json["choices"][0]["message"]["content"]
    print(answer)
else:
    # Print an error message if the request failed
    print("Error:", response.text)