# AI model configuration

## Local provider model

This app expects a local model provider such as Ollama to be installed. A good default is `llama3.1:8b` for quest generation. For vision use a compatible local vision-capable model when hardware permits.

## Config

The app reads model settings from environment variables or a local config file.

Example:

```env
MODEL_NAME=llama3.1:8b
LOCAL_OLLAMA_URL=http://localhost:11434
```

## Important notes

- Local AI is optional for the core offline MVP.
- The application uses a fallback quest library when the model is missing or fails.
- Any model output should be treated as advisory, not expert verification.
