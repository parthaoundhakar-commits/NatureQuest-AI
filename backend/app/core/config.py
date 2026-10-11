from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "naturequest-ai"
    debug: bool = False
    model_name: str = "llama3.1:8b"
    local_ollama_url: str = "http://localhost:11434"


settings = Settings()
