from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import List, Optional
from decimal import Decimal

class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: float # Appwrite uses double/float
    sale_price: Optional[float] = None
    sizes: List[str] = []
    images: List[str] = []
    stock_status: str = "in_stock"
    is_featured: bool = False
    category_id: Optional[str] = None # Change from UUID to str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    sale_price: Optional[float] = None
    sizes: Optional[List[str]] = None
    images: Optional[List[str]] = None
    stock_status: Optional[str] = None
    is_featured: Optional[bool] = None
    category_id: Optional[str] = None

class ProductResponse(ProductBase):
    id: str # Change from UUID to str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
