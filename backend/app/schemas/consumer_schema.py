from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal, Optional, List
from datetime import datetime

# Consumer-specific Input Schema
class ConsumerCreate(BaseModel):
    email: EmailStr
    password: str
    username: str
    user_type: Literal['consumer'] # Enforce type for this schema

# Consumer-specific Output Schema
class ConsumerOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    user_type: Literal['consumer']
    created_at: Optional[datetime] = None
    profile_pic: Optional[str] = None
    recentlySearch: List[str]

    class Config:
        from_attributes = True
    
    # --- Validator to convert string to list on output ---
    @field_validator('recentlySearch', mode='before')
    @classmethod
    def split_search_string(cls, v):
        """Converts the pipe-delimited string from the DB into a list of strings."""
        if isinstance(v, str) and v:
            # Split the string by the pipe symbol (|)
            return v.split('|')
        return [] # Return an empty list if the string is empty or None

# --- JWT Output Schema ---
class Consumer_Token(BaseModel):
    access_token: str
    token_type: str
    user: ConsumerOut

class UpdateProfileResponse(BaseModel):
    message: str
    user: ConsumerOut # <--- Nest the ORM-enabled schema here