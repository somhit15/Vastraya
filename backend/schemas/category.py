from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    slug: str
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    image_url: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: str # Change from UUID to str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
