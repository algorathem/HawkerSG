from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Literal, Optional, List
from datetime import datetime, time
from decimal import Decimal

# Business-specific Input Schema for Signup
class BusinessCreate(BaseModel):
    email: EmailStr
    password: str
    username: str
    user_type: Literal['business'] = 'business'
    stall_name: str
    uen: str  # Unique Entity Number from CorpPass
    description: Optional[str] = None
    photo: Optional[str] = None
    
    @field_validator('description')
    def validate_description_length(cls, v):
        if v and len(v.split()) > 100:
            raise ValueError('Description must not exceed 100 words')
        return v

# Business-specific Output Schema
class BusinessOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    user_type: Literal['business']
    stall_name: str
    status: str  # 'open' or 'closed'
    description: Optional[str] = None
    photo: Optional[str] = None
    created_at: Optional[datetime] = None
    uen: str
    operating_hours: Optional[List['OperatingHourOut']] = []
    menu_items: Optional[List['MenuItemOut']] = []
    
    class Config:
        from_attributes = True

# Operating Hours Schema
class OperatingHourIn(BaseModel):
    day: Literal['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    start_time: time
    end_time: time
    
    @field_validator('end_time')
    def validate_time_order(cls, v, values):
        if 'start_time' in values.data and v <= values.data['start_time']:
            raise ValueError('End time must be after start time')
        return v

class OperatingHourOut(BaseModel):
    id: int
    day: str
    start_time: time
    end_time: time
    
    class Config:
        from_attributes = True

# Menu Item Schemas
class MenuItemIn(BaseModel):
    name: str = Field(..., max_length=100)
    price: Decimal = Field(..., decimal_places=2, ge=0)
    photo: Optional[str] = None

class MenuItemOut(BaseModel):
    id: int
    name: str
    price: Decimal
    photo: Optional[str] = None
    
    class Config:
        from_attributes = True