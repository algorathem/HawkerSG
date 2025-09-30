from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.schemas.business_schema import BusinessCreate, OperatingHourIn, MenuItemIn
from app.models.business_model import Business, StallStatus
from app.models.operating_hour_model import OperatingHour
from app.models.menu_item_model import MenuItem
from app.models.user_model import User as DBUser
from typing import Optional, List
from datetime import datetime

# Define the password hashing context (same as consumer)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# --- Hashing Functions (reuse from consumer pattern) ---
def get_password_hash(password: str) -> str:
    """Hashes a plaintext password using Argon2."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plaintext password against a stored hash."""
    return pwd_context.verify(plain_password, hashed_password)

# --- DB Interaction Functions ---
def get_user_by_email(db: Session, email: str) -> Optional[DBUser]:
    """Retrieves a user (Business or other type) by email."""
    return db.query(DBUser).filter(DBUser.email == email).first()

def get_business_by_id(db: Session, business_id: int) -> Optional[Business]:
    """Retrieves a business by id."""
    return db.query(Business).filter(Business.id == business_id).first()

def create_business(db: Session, business: BusinessCreate) -> Business:
    """The core business logic for signing up a new Business Owner."""
    
    hashed_password = get_password_hash(business.password)
    
    # Create the Business DB model instance
    db_business = Business(
        email=business.email,
        hashed_password=hashed_password,
        username=business.username,
        user_type="business",
        stall_name=business.stall_name,
        uen=business.uen,
        description=business.description,
        photo=business.photo,
        status=StallStatus.OPEN
    )
    
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business