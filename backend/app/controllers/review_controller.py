from typing import Dict, List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.review_schema import ReviewIn, ReviewOut
from app.models.consumer_model import Consumer
from app.services import review_store as store

def _ensure_consumer(db: Session, consumer_id: int):
    if not db.query(Consumer).filter(Consumer.id == consumer_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consumer not found")

def _serialize(row: Dict[str, str]) -> ReviewOut:
    # Convert CSV row -> ReviewOut (types)
    return ReviewOut(
        id=int(row["id"]),
        consumer_id=int(row["consumer_id"]),
        target_type=row["target_type"],  # type: ignore
        target_id=int(row["target_id"]),
        star_rating=int(row["star_rating"]),
        description=row["description"],
        images=[p for p in (row.get("images") or "").split("|") if p] if row.get("images") else [],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
    )

def create_review(db: Session, consumer_id: int, payload: ReviewIn) -> Dict:
    _ensure_consumer(db, consumer_id)
    # Optional: validate target existence here (Business/HawkerCentre) same pattern as favourites
    row = store.create(
        consumer_id=consumer_id,
        target_type=payload.target_type,
        target_id=payload.target_id,
        star_rating=payload.star_rating,
        description=payload.description or "",
        images=payload.images or [],
    )
    return {"message": "Review stored", "review": _serialize(row)}

"""def update_review(db: Session, consumer_id: int, review_id: int, payload: ReviewUpdate) -> Dict:
    _ensure_consumer(db, consumer_id)
    row = store.update(
        review_id=review_id,
        consumer_id=consumer_id,
        star_rating=payload.star_rating,
        description=payload.description if payload.description is not None else None,
        images=payload.images if payload.images is not None else None,
    )
    if not row:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review updated", "review": _serialize(row)}
"""
def delete_review(db: Session, consumer_id: int, review_id: int) -> Dict:
    _ensure_consumer(db, consumer_id)
    if not store.delete(review_id, consumer_id):
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted"}

def list_reviews_for_target(db: Session, target_type: str, target_id: int) -> List[Dict]:
    rows = store.list_for_target(target_type, target_id)
    return [_serialize(r).model_dump() for r in rows]

def list_reviews_for_consumer(db: Session, consumer_id: int) -> List[Dict]:
    _ensure_consumer(db, consumer_id)
    rows = store.list_for_consumer(consumer_id)
    return [_serialize(r).model_dump() for r in rows]

def get_avg_rating(db: Session, target_type: str, target_id: int) -> Dict:
    avg = store.avg_rating(target_type, target_id)
    return {"target_type": target_type, "target_id": target_id, "average_rating": avg, "count": len(store.list_for_target(target_type, target_id))}
