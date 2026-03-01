from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from appwrite.services.databases import Databases
from appwrite.query import Query
from appwrite.id import ID
from typing import List
from database import get_databases
from config import settings
from schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from middleware.auth_middleware import get_current_admin
from services.storage_service import storage_service

router = APIRouter(prefix="/categories", tags=["categories"])

# --- Public Endpoints ---

@router.get("/", response_model=List[CategoryResponse])
async def list_categories(db: Databases = Depends(get_databases)):
    result = db.list_documents(
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.APPWRITE_CATEGORIES_COLLECTION_ID,
        queries=[Query.order_asc("name")]
    )
    # Appwrite returns metadata in the document, we map $id to id
    categories = []
    for doc in result['documents']:
        doc['id'] = doc['$id']
        categories.append(doc)
    return categories

@router.get("/{slug}", response_model=CategoryResponse)
async def get_category(slug: str, db: Databases = Depends(get_databases)):
    result = db.list_documents(
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.APPWRITE_CATEGORIES_COLLECTION_ID,
        queries=[Query.equal("slug", slug), Query.limit(1)]
    )
    if not result['documents']:
        raise HTTPException(status_code=404, detail="Category not found")
    
    category = result['documents'][0]
    category['id'] = category['$id']
    return category

# --- Admin Protected Endpoints ---

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_in: CategoryCreate,
    db: Databases = Depends(get_databases),
    admin=Depends(get_current_admin)
):
    # Check if slug exists
    existing = db.list_documents(
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.APPWRITE_CATEGORIES_COLLECTION_ID,
        queries=[Query.equal("slug", category_in.slug)]
    )
    if existing['documents']:
        raise HTTPException(status_code=400, detail="Slug already exists")

    new_category = db.create_document(
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.APPWRITE_CATEGORIES_COLLECTION_ID,
        document_id=ID.unique(),
        data=category_in.model_dump()
    )
    new_category['id'] = new_category['$id']
    return new_category

@router.patch("/{id}", response_model=CategoryResponse)
async def update_category(
    id: str,
    category_in: CategoryUpdate,
    db: Databases = Depends(get_databases),
    admin=Depends(get_current_admin)
):
    update_data = category_in.model_dump(exclude_unset=True)
    try:
        updated = db.update_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_CATEGORIES_COLLECTION_ID,
            document_id=id,
            data=update_data
        )
        updated['id'] = updated['$id']
        return updated
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Category not found or error: {str(e)}")

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    id: str,
    db: Databases = Depends(get_databases),
    admin=Depends(get_current_admin)
):
    db.delete_document(
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.APPWRITE_CATEGORIES_COLLECTION_ID,
        document_id=id
    )
    return None

@router.post("/upload-image", tags=["admin"])
async def upload_category_image(
    file: UploadFile = File(...),
    admin=Depends(get_current_admin)
):
    content = await file.read()
    public_url = await storage_service.upload_file(content, file.filename)
    return {"url": public_url}
