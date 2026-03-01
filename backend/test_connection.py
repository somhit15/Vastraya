import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from supabase import create_client
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

async def test_db():
    print("--- Testing Database Connection ---")
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("❌ DATABASE_URL not found in .env")
        return False
    
    if "asyncpg" not in db_url:
        print("❌ Error: DATABASE_URL must use 'postgresql+asyncpg://' for async support.")
        print(f"Current URL starts with: {db_url.split('://')[0] if '://' in db_url else 'None'}")
        return False

    try:
        engine = create_async_engine(db_url)
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print(f"✅ Database connected: {result.fetchone()}")
        await engine.dispose()
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_supabase_storage():
    print("\n--- Testing Supabase Storage ---")
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    bucket = os.getenv("SUPABASE_BUCKET_NAME", "product-images")

    if not url or not key:
        print("❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env")
        return False

    try:
        supabase = create_client(url, key)
        # Try to list buckets to verify access
        response = supabase.storage.list_buckets()
        
        # In newer supabase-py versions, response might be a list directly or an object
        buckets = response if isinstance(response, list) else getattr(response, 'data', [])
        
        print(f"✅ Supabase Client connected. Found {len(buckets)} buckets.")
        
        # Check if our specific bucket exists
        bucket_names = [b.name if hasattr(b, 'name') else b.get('name') for b in buckets]
        if bucket in bucket_names:
            print(f"✅ Bucket '{bucket}' exists.")
        else:
            print(f"⚠️  Bucket '{bucket}' NOT found. Please create it in Supabase Dashboard.")
        
        return True
    except Exception as e:
        print(f"❌ Supabase Storage client failed: {e}")
        return False

async def main():
    db_ok = await test_db()
    storage_ok = test_supabase_storage()
    
    print("\n--- Summary ---")
    if db_ok and storage_ok:
        print("🚀 All systems go! Backend is ready.")
    else:
        print("🛠️  Please fix the issues above before running the backend.")

if __name__ == "__main__":
    asyncio.run(main())
