from pydantic import BaseModel, EmailStr
from typing import Literal, Optional
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

    class Config:
        from_attributes = True