from appwrite.services.storage import Storage
from appwrite.id import ID
from appwrite.input_file import InputFile
from database import get_storage
from config import settings

class StorageService:
    def __init__(self):
        self.storage = get_storage()
        self.bucket_id = settings.APPWRITE_BUCKET_ID

    async def upload_file(self, file_content: bytes, filename: str) -> str:
        # Appwrite bucket needs file as InputFile
        # Note: Appwrite SDK is sync, so we wrap it or use it directly
        result = self.storage.create_file(
            bucket_id=self.bucket_id,
            file_id=ID.unique(),
            file=InputFile.from_bytes(file_content, filename)
        )
        
        # Construct public URL (Appwrite format)
        # https://[ENDPOINT]/storage/buckets/[BUCKET_ID]/files/[FILE_ID]/view?project=[PROJECT_ID]
        file_id = result['$id']
        public_url = f"{settings.APPWRITE_ENDPOINT}/storage/buckets/{self.bucket_id}/files/{file_id}/view?project={settings.APPWRITE_PROJECT_ID}"
        return public_url

storage_service = StorageService()
