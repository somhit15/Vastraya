import os
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from dotenv import load_dotenv

load_dotenv()

def test_appwrite():
    print("--- Testing Appwrite Connection ---")
    
    client = Client()
    endpoint = os.getenv("APPWRITE_ENDPOINT")
    project_id = os.getenv("APPWRITE_PROJECT_ID")
    api_key = os.getenv("APPWRITE_API_KEY")
    database_id = os.getenv("APPWRITE_DATABASE_ID")

    if not all([endpoint, project_id, api_key, database_id]):
        print("❌ Missing environment variables in .env")
        return

    client.set_endpoint(endpoint or "https://cloud.appwrite.io/v1")
    client.set_project(project_id)
    client.set_key(api_key)

    databases = Databases(client)
    storage = Storage(client)

    # 1. Test Database Access
    try:
        db = databases.get(database_id=database_id)
        print(f"✅ Database found: {db['name']} (ID: {db['$id']})")
        
        # 2. List Collections (Tables)
        collections = databases.list_collections(database_id=database_id)
        print(f"\nFound {len(collections['collections'])} Collections (Tables):")
        for col in collections['collections']:
            print(f" - Name: {col['name']}, ID: {col['$id']}")
            
    except Exception as e:
        print(f"❌ Database error: {e}")

    # 3. Test Storage Access
    try:
        bucket_id = os.getenv("APPWRITE_BUCKET_ID")
        if bucket_id:
            bucket = storage.get_bucket(bucket_id=bucket_id)
            print(f"\n✅ Bucket found: {bucket['name']} (ID: {bucket['$id']})")
    except Exception as e:
        print(f"❌ Storage error: {e}")

if __name__ == "__main__":
    test_appwrite()
