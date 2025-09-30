from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.business_schema import BusinessCreate, BusinessOut, MenuItemIn, MenuItemOut
from app.schemas.user_schema import UserLogin
from app.controllers import business_controller
from typing import List

router = APIRouter(prefix="/business")

@router.post("/signup", response_model=BusinessOut, status_code=status.HTTP_201_CREATED)
def signup_business(business_in: BusinessCreate, db: Session = Depends(get_db)):
    """Handles the POST request for business owner sign up."""
    
    # Check if email already exists
    if business_controller.get_user_by_email(db, business_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        # Create new business account
        new_business = business_controller.create_business(db, business=business_in)
        return new_business
    except Exception as e:
        print(f"Error during business signup: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create business account."
        )

@router.post("/login", response_model=BusinessOut)
def login_business(user_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticates a business owner by email and password."""
    
    # 1. Retrieve user by email
    db_user = business_controller.get_user_by_email(db, user_in.email)
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # 2. Verify password hash
    if not business_controller.verify_password(user_in.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # 3. Check user type (must be business)
    if db_user.user_type != "business":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # 4. Success: return the business data
    return db_user