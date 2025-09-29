from pydantic import BaseModel, EmailStr
from typing import Literal

# User Input Schema for Login
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    user_type: Literal['consumer', 'business']
