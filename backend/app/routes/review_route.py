from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.review_schema import ReviewIn
from app.controllers import review_controller as ctrl

router = APIRouter(prefix="", tags=["Reviews"])

# Create a review
@router.post("/consumers/{consumer_id}/reviews", status_code=status.HTTP_201_CREATED)
def create_review(consumer_id: int, payload: ReviewIn, db: Session = Depends(get_db)):
    return ctrl.create_review(db, consumer_id, payload)

"""# Update a review (only owner)
@router.put("/consumers/{consumer_id}/reviews/{review_id}")
def update_review(consumer_id: int, review_id: int, payload: ReviewUpdate, db: Session = Depends(get_db)):
    return ctrl.update_review(db, consumer_id, review_id, payload)
"""
# Delete a review (only owner)
@router.delete("/consumers/{consumer_id}/reviews/{review_id}")
def delete_review(consumer_id: int, review_id: int, db: Session = Depends(get_db)):
    return ctrl.delete_review(db, consumer_id, review_id)

# List reviews for a target (business/hawker)
@router.get("/targets/{target_type}/{target_id}/reviews")
def list_reviews_for_target(target_type: str, target_id: int, db: Session = Depends(get_db)):
    return ctrl.list_reviews_for_target(db, target_type, target_id)

# List reviews created by a consumer
@router.get("/consumers/{consumer_id}/reviews")
def list_reviews_for_consumer(consumer_id: int, db: Session = Depends(get_db)):
    return ctrl.list_reviews_for_consumer(db, consumer_id)

# Average rating for a target
@router.get("/targets/{target_type}/{target_id}/reviews/average")
def get_avg_rating(target_type: str, target_id: int, db: Session = Depends(get_db)):
    return ctrl.get_avg_rating(db, target_type, target_id)
