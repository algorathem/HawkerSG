from app.models.user_model import User
from app.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

class StallStatus(enum.Enum):
    OPEN = "open"
    CLOSED = "closed"

class Business(User):
    __tablename__ = "businesses"
    
    id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    stall_name = Column(String, index=True, nullable=False)
    description = Column(String(1000), nullable=True)  # ~100 words with avg 10 chars/word
    status = Column(Enum(StallStatus), default=StallStatus.OPEN)
    photo = Column(String, nullable=True)  # Store URL/path to photo
    uen = Column(String, nullable=False)  # Unique Entity Number from CorpPass
    hawker_centre_id = Column(Integer, nullable=True)  # Optional FK to hawker centres
    
    # Relationships
    operating_hours = relationship("OperatingHour", back_populates="business", cascade="all, delete-orphan")
    menu_items = relationship("MenuItem", back_populates="business", cascade="all, delete-orphan")
    # Future relationships (scaffolded):
    # reviews = relationship("Review", back_populates="business")
    # favourites = relationship("Favourite", back_populates="business")
    
    __mapper_args__ = {
        "polymorphic_identity": "business",
    }
