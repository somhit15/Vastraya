from sqlalchemy import Column, String, UUID, DateTime, Numeric, Boolean, ARRAY, ForeignKey, func
from sqlalchemy.orm import relationship
import uuid
from ..database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(String, nullable=True)
    price = Column(Numeric(12, 2), nullable=False)
    sale_price = Column(Numeric(12, 2), nullable=True)
    sizes = Column(ARRAY(String), default=[])
    images = Column(ARRAY(String), default=[])
    stock_status = Column(String(50), default="in_stock")
    is_featured = Column(Boolean, default=False)
    
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    category = relationship("Category", back_populates="products")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
