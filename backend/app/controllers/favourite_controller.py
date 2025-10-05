from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Dict
from app.models.consumer_model import Consumer
from app.schemas.favourite_schema import FavouriteIn
from app.services import favourite_store as store

def _ensure_consumer(db: Session, consumer_id: int):
    if not db.query(Consumer).filter(Consumer.id == consumer_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consumer not found")

def add_favourite(db: Session, consumer_id: int, payload: FavouriteIn) -> Dict:
    _ensure_consumer(db, consumer_id)
    added = store.add(consumer_id, payload.target_type, payload.target_id)
    return {
        "status": "ok",
        "action": "added" if added else "exists",
        "consumer_id": consumer_id,
        "target_type": payload.target_type,
        "target_id": payload.target_id,
    }

def remove_favourite(db: Session, consumer_id: int, payload: FavouriteIn) -> Dict:
    _ensure_consumer(db, consumer_id)
    removed = store.remove(consumer_id, payload.target_type, payload.target_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Favourite not found")
    return {"status": "ok", "action": "removed"}

def list_favourites(db: Session, consumer_id: int) -> List[Dict]:
    _ensure_consumer(db, consumer_id)
    return store.list_by_consumer(consumer_id)

def is_favourite(db: Session, consumer_id: int, payload: FavouriteIn) -> Dict:
    _ensure_consumer(db, consumer_id)
    return {
        "is_favourite": store.is_favourite(consumer_id, payload.target_type, payload.target_id)
    }

def toggle_favourite(db: Session, consumer_id: int, payload: FavouriteIn) -> Dict:
    _ensure_consumer(db, consumer_id)
    if store.is_favourite(consumer_id, payload.target_type, payload.target_id):
        store.remove(consumer_id, payload.target_type, payload.target_id)
        return {"status": "ok", "action": "removed"}
    else:
        store.add(consumer_id, payload.target_type, payload.target_id)
        return {"status": "ok", "action": "added"}
