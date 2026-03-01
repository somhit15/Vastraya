import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

async def create_schema():
    print("--- Executing Database Schema Creation ---")
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("❌ DATABASE_URL not found in .env")
        return False

    sql = """
    -- Categories Table
    CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Products Table
    CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(12, 2) NOT NULL,
        sale_price DECIMAL(12, 2),
        sizes TEXT[] DEFAULT '{}',
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        images TEXT[] DEFAULT '{}',
        stock_status VARCHAR(50) DEFAULT 'in_stock',
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Admin Users Table
    CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(100) UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
    """

    try:
        engine = create_async_engine(db_url)
        async with engine.begin() as conn:
            # SQLAlchemy text() expects a single statement or multiple separated by semicolons
            # Executing as a single block
            await conn.execute(text(sql))
            print("✅ Database schema created successfully!")
        await engine.dispose()
        return True
    except Exception as e:
        import traceback
        print(f"❌ Schema creation failed: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    asyncio.run(create_schema())
