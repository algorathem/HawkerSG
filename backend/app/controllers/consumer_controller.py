from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.schemas.consumer_schema import ConsumerCreate
from app.models.consumer_model import Consumer
from app.models.user_model import User as DBUser
from typing import Optional

# Define the password hashing context
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# --- Hashing Functions ---
def get_password_hash(password: str) -> str:
    """Hashes a plaintext password using Argon2."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plaintext password against a stored hash."""
    return pwd_context.verify(plain_password, hashed_password)

# --- DB Interaction Functions ---
def get_user_by_email(db: Session, email: str) -> Optional[DBUser]:
    """Retrieves a user (Consumer or other type) by email."""
    # Query the base User class 
    return db.query(DBUser).filter(DBUser.email == email).first() 

def create_user(db: Session, user: ConsumerCreate) -> Consumer:
    """The core business logic for signing up a new Consumer."""

    hashed_password = get_password_hash(user.password)

    # Create the Consumer DB model instance
    db_user = Consumer( 
        email=user.email, 
        hashed_password=hashed_password,
        username=user.username,
        user_type=user.user_type,
        profile_pic=None 
    )
 
    db.add(db_user)
    db.commit()
    db.refresh(db_user) 
    return db_user
