from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from decimal import Decimal

class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: Decimal
    sale_price: Optional[Decimal] = None
    sizes: List[str] = []
    images: List[str] = []
    stock_status: str = "in_stock"
    is_featured: bool = False
    category_id: Optional[UUID] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    sale_price: Optional[Decimal] = None
    sizes: Optional[List[str]] = None
    images: Optional[List[str]] = None
    stock_status: Optional[str] = None
    is_featured: Optional[bool] = None
    category_id: Optional[UUID] = None

class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
