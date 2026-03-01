import os
import time
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID
from dotenv import load_dotenv

load_dotenv()

def seed_data():
    client = Client()
    client.set_endpoint(os.getenv("APPWRITE_ENDPOINT"))
    client.set_project(os.getenv("APPWRITE_PROJECT_ID"))
    client.set_key(os.getenv("APPWRITE_API_KEY"))

    db = Databases(client)
    db_id = os.getenv("APPWRITE_DATABASE_ID")
    cat_col = os.getenv("APPWRITE_CATEGORIES_COLLECTION_ID")
    prod_col = os.getenv("APPWRITE_PRODUCTS_COLLECTION_ID")

    print("--- Seeding Initial Data ---")

    # 1. Add Categories
    categories = [
        {"name": "Kurtas", "slug": "kurtas", "image_url": "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800"},
        {"name": "Sarees", "slug": "sarees", "image_url": "https://images.unsplash.com/photo-1610030469668-935142b9c7a6?q=80&w=800"},
        {"name": "Lehengas", "slug": "lehengas", "image_url": "https://images.unsplash.com/photo-1583391733975-ac5212fb9ba6?q=80&w=800"}
    ]

    cat_map = {}
    for cat in categories:
        try:
            res = db.create_document(db_id, cat_col, ID.unique(), cat)
            cat_map[cat['slug']] = res['$id']
            print(f"✅ Added Category: {cat['name']}")
        except Exception as e:
            print(f"⚠️ Category {cat['name']} error: {e}")

    # 2. Add Products
    products = [
        {
            "name": "Emerald Silk Kurta",
            "slug": "emerald-silk-kurta",
            "description": "A premium emerald green silk kurta with intricate gold embroidery on the neck and cuffs.",
            "price": 3499.0,
            "sale_price": 2999.0,
            "sizes": ["S", "M", "L", "XL"],
            "category_id": cat_map.get("kurtas", ""),
            "images": ["https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?q=80&w=800"],
            "stock_status": "in_stock",
            "is_featured": True
        },
        {
            "name": "Classic Banarasi Saree",
            "slug": "classic-banarasi-saree",
            "description": "Authentic hand-woven Banarasi silk saree with traditional motifs and heavy zari work.",
            "price": 8999.0,
            "sale_price": 7499.0,
            "sizes": ["One Size"],
            "category_id": cat_map.get("sarees", ""),
            "images": ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800"],
            "stock_status": "in_stock",
            "is_featured": True
        },
        {
            "name": "Floral Summer Kurta",
            "slug": "floral-summer-kurta",
            "description": "Breathable cotton kurta with vibrant floral prints, perfect for casual summer outings.",
            "price": 1499.0,
            "sizes": ["M", "L", "XL", "XXL"],
            "category_id": cat_map.get("kurtas", ""),
            "images": ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800"],
            "stock_status": "in_stock",
            "is_featured": False
        }
    ]

    for prod in products:
        try:
            db.create_document(db_id, prod_col, ID.unique(), prod)
            print(f"✅ Added Product: {prod['name']}")
        except Exception as e:
            print(f"⚠️ Product {prod['name']} error: {e}")

    print("🚀 Seeding complete!")

if __name__ == "__main__":
    seed_data()
