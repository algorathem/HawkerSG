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

def add_recent_search(db: Session, consumer_id: int, new_term: str):
    consumer = db.query(Consumer).filter(Consumer.id == consumer_id).first()
    if not consumer:
        return None

    # 1. Deserialize: Split the current string into a list
    current_list = consumer.recentlySearch.split('|') if consumer.recentlySearch else []
    
    # Remove duplicates and put the newest term at the front
    current_list = [term for term in current_list if term != new_term]
    current_list.insert(0, new_term)

    # Limit the list size (e.g., last 5 searches)
    current_list = current_list[:5]

    # 2. Serialize: Join the list back into a string using '|'
    consumer.recentlySearch = '|'.join(current_list)
    
    db.commit()
    db.refresh(consumer)
    return consumer
