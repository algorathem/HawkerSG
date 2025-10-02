from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.consumer_schema import ConsumerCreate, ConsumerOut
from app.schemas.user_schema import UserLogin
from app.controllers import consumer_controller
from app.schemas.user_schema import PasswordResetRequest, PasswordResetData

router = APIRouter(prefix="/consumer")

@router.post("/signup", response_model=ConsumerOut, status_code=status.HTTP_201_CREATED)
def signup_user(user_in: ConsumerCreate, db: Session = Depends(get_db)): # <-- Use ConsumerCreate
    """Handles the POST request for user sign up."""

    if consumer_controller.get_user_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    try:
        # Returns a Consumer object which is mapped to ConsumerOut
        new_user = consumer_controller.create_user(db, user=user_in) 
        return new_user
    except Exception as e:
        print(f"Error during sign up: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create user.")

@router.post("/login", response_model=ConsumerOut) # <-- Use ConsumerOut as response_model
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticates a user by email and password."""
    # 1. Retrieve user by email using the service function
    db_user = consumer_controller.get_user_by_email(db, user_in.email) 

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # 2. Verify password hash
    if not consumer_controller.verify_password(user_in.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # 3. Check user type (important for polymorphism/frontend)
    if db_user.user_type != user_in.user_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # 4. Success: return the user data
    return db_user

@router.post("/forgot-password", status_code=200)
def request_password_reset(
    request: PasswordResetRequest, 
    db: Session = Depends(get_db)
):
    """
    Initiates the password reset flow.
    Returns a success status regardless of whether the email is registered
    (for security).
    """
    # The controller handles the lookup, token generation, and email sending
    consumer_controller.handle_password_reset_request(db, request)
    
    # Return a generic success response to implement the security best practice
    return {"message": "If the email is registered, a password reset link has been sent."}

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_user_password(
    data: PasswordResetData, 
    db: Session = Depends(get_db)
):
    """
    Finalizes the password reset by validating the token and setting the new password.
    """
    try:
        consumer_controller.handle_password_reset(db, data)
        return {"message": "Password successfully reset."}
    except HTTPException as e:
        # Re-raise explicit exceptions from the controller
        raise e
    except Exception:
        # Catch unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during password reset."
        )
