from pydantic import BaseModel, Field, field_validator
from typing import Literal, Optional, List
from datetime import datetime

TargetType = Literal["business", "hawker"]

class ReviewIn(BaseModel):
    target_type: TargetType
    target_id: int
    star_rating: int = Field(..., ge=1, le=5)  # 1..5
    description: Optional[str] = Field(default="", max_length=250)
    images: Optional[List[str]] = None  # store as list; service serializes

    @field_validator("description")
    @classmethod
    def trim_description(cls, v: Optional[str]) -> str:
        return (v or "").strip()

"""class ReviewUpdate(BaseModel):
    # allow partial update
    star_rating: Optional[int] = Field(default=None, ge=1, le=5)
    description: Optional[str] = Field(default=None, max_length=250)
    images: Optional[List[str]] = None
"""
class ReviewOut(BaseModel):
    id: int
    consumer_id: int
    target_type: TargetType
    target_id: int
    star_rating: int
    description: str
    images: List[str]
    created_at: datetime
    updated_at: datetime
