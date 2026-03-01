from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APPWRITE_ENDPOINT: str = "https://cloud.appwrite.io/v1"
    APPWRITE_PROJECT_ID: str
    APPWRITE_API_KEY: str
    APPWRITE_DATABASE_ID: str
    APPWRITE_PRODUCTS_COLLECTION_ID: str
    APPWRITE_CATEGORIES_COLLECTION_ID: str
    APPWRITE_BUCKET_ID: str
    
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
