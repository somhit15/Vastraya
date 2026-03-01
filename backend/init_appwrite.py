import os
import time
from appwrite.client import Client
from appwrite.services.databases import Databases
from dotenv import load_dotenv

load_dotenv()

def init_appwrite():
    client = Client()
    client.set_endpoint(os.getenv("APPWRITE_ENDPOINT"))
    client.set_project(os.getenv("APPWRITE_PROJECT_ID"))
    client.set_key(os.getenv("APPWRITE_API_KEY"))

    db = Databases(client)
    db_id = os.getenv("APPWRITE_DATABASE_ID")
    cat_col = os.getenv("APPWRITE_CATEGORIES_COLLECTION_ID")
    prod_col = os.getenv("APPWRITE_PRODUCTS_COLLECTION_ID")

    print(f"--- Initializing Appwrite Schema for DB: {db_id} ---")

    # --- 1. Categories Attributes ---
    print("Creating attributes for 'categories'...")
    try:
        db.create_string_attribute(db_id, cat_col, "name", 255, True)
        db.create_string_attribute(db_id, cat_col, "slug", 255, True)
        db.create_string_attribute(db_id, cat_col, "image_url", 1024, False)
        # Create Index
        time.sleep(2) # Give Appwrite a moment to process
        db.create_index(db_id, cat_col, "idx_cat_slug", "unique", ["slug"])
        print("✅ Categories attributes & index created.")
    except Exception as e:
        print(f"⚠️ Categories setup: {e}")

    # --- 2. Products Attributes ---
    print("Creating attributes for 'products'...")
    try:
        db.create_string_attribute(db_id, prod_col, "name", 255, True)
        db.create_string_attribute(db_id, prod_col, "slug", 255, True)
        db.create_string_attribute(db_id, prod_col, "description", 5000, True)
        db.create_float_attribute(db_id, prod_col, "price", True)
        db.create_float_attribute(db_id, prod_col, "sale_price", False)
        db.create_string_attribute(db_id, prod_col, "sizes", 50, False, array=True)
        db.create_string_attribute(db_id, prod_col, "category_id", 255, True)
        db.create_string_attribute(db_id, prod_col, "images", 1024, False, array=True)
        db.create_string_attribute(db_id, prod_col, "stock_status", 50, False, default="in_stock")
        db.create_boolean_attribute(db_id, prod_col, "is_featured", False, default=False)
        
        # Create Indexes
        time.sleep(5) # Wait for attributes to propagate
        db.create_index(db_id, prod_col, "idx_prod_slug", "unique", ["slug"])
        db.create_index(db_id, prod_col, "idx_prod_featured", "key", ["is_featured"])
        db.create_index(db_id, prod_col, "idx_prod_cat", "key", ["category_id"])
        print("✅ Products attributes & indexes created.")
    except Exception as e:
        print(f"⚠️ Products setup: {e}")

    print("🚀 Schema initialization complete! Check your Appwrite console.")

if __name__ == "__main__":
    init_appwrite()
