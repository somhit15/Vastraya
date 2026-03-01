from fastapi import APIRouter, Depends, HTTPException, status, Query as FastAPIQuery, UploadFile, File
from appwrite.services.databases import Databases
from appwrite.query import Query as AppwriteQuery
from appwrite.id import ID
from typing import List, Optional
from database import get_databases
from config import settings
from schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse
from middleware.auth_middleware import get_current_admin
from services.storage_service import storage_service

router = APIRouter(prefix="/products", tags=["products"])

# --- Public Endpoints ---

@router.get("/", response_model=ProductListResponse)
async def list_products(
    page: int = FastAPIQuery(1, ge=1),
    limit: int = FastAPIQuery(20, ge=1, le=100),
    category_slug: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Databases = Depends(get_databases)
):
    queries = [
        AppwriteQuery.limit(limit),
        AppwriteQuery.offset((page - 1) * limit),
        AppwriteQuery.order_desc("$createdAt")
    ]

    if featured is not None:
        queries.append(AppwriteQuery.equal("is_featured", featured))
    
    if search:
        # Appwrite search is case-sensitive or requires indexes, but here we'll use 'equal' for basic
        # In a real app, use Search index attributes
        queries.append(AppwriteQuery.search("name", search))

    if category_slug:
        # We need to find the category ID first
        cat_result = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_CATEGORIES_COLLECTION_ID,
            queries=[AppwriteQuery.equal("slug", category_slug), AppwriteQuery.limit(1)]
        )
        if cat_result['documents']:
            cat_id = cat_result['documents'][0]['$id']
            queries.append(AppwriteQuery.equal("category_id", cat_id))

    result = db.list_documents(
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.APPWRITE_PRODUCTS_COLLECTION_ID,
        queries=queries
    )

    products = []
    for doc in result['documents']:
        doc['id'] = doc['$id']
        doc['created_at'] = doc['$createdAt']
        doc['updated_at'] = doc['$updatedAt']
        products.append(doc)

    return {
        "items": products,
        "total": result['total'],
        "page": page,
        "limit": limit
    }

@router.get("/{slug}", response_model=ProductResponse)
async def get_product(slug: str, db: Databases = Depends(get_databases)):
    result = db.list_documents(
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.APPWRITE_PRODUCTS_COLLECTION_ID,
        queries=[Query.equal("slug", slug), Query.limit(1)]
    )
    if not result['documents']:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product = result['documents'][0]
    product['id'] = product['$id']
    product['created_at'] = product['$createdAt']
    product['updated_at'] = product['$updatedAt']
    return product

# --- Admin Protected Endpoints ---

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    db: Databases = Depends(get_databases),
    admin=Depends(get_current_admin)
):
    # Check if slug exists
    existing = db.list_documents(
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.APPWRITE_PRODUCTS_COLLECTION_ID,
        queries=[Query.equal("slug", product_in.slug)]
    )
    if existing['documents']:
        raise HTTPException(status_code=400, detail="Slug already exists")

    new_product = db.create_document(
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.APPWRITE_PRODUCTS_COLLECTION_ID,
        document_id=ID.unique(),
        data=product_in.model_dump()
    )
    new_product['id'] = new_product['$id']
    new_product['created_at'] = new_product['$createdAt']
    new_product['updated_at'] = new_product['$updatedAt']
    return new_product

@router.patch("/{id}", response_model=ProductResponse)
async def update_product(
    id: str,
    product_in: ProductUpdate,
    db: Databases = Depends(get_databases),
    admin=Depends(get_current_admin)
):
    update_data = product_in.model_dump(exclude_unset=True)
    try:
        updated = db.update_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_PRODUCTS_COLLECTION_ID,
            document_id=id,
            data=update_data
        )
        updated['id'] = updated['$id']
        updated['created_at'] = updated['$createdAt']
        updated['updated_at'] = updated['$updatedAt']
        return updated
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Product not found or error: {str(e)}")

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    id: str,
    db: Databases = Depends(get_databases),
    admin=Depends(get_current_admin)
):
    db.delete_document(
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.APPWRITE_PRODUCTS_COLLECTION_ID,
        document_id=id
    )
    return None

@router.post("/upload-images", tags=["admin"])
async def upload_product_images(
    files: List[UploadFile] = File(...),
    admin=Depends(get_current_admin)
):
    urls = []
    for file in files:
        content = await file.read()
        public_url = await storage_service.upload_file(content, file.filename)
        urls.append(public_url)
    return {"urls": urls}
