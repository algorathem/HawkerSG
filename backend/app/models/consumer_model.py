from app.models.user_model import User
from sqlalchemy import Column, Integer, String, ForeignKey

# The Consumer class inheriting from User
class Consumer(User):
    __tablename__ = "consumers"
    id = Column(Integer, ForeignKey('users.id'), primary_key=True) 

    # Consumer-specific field
    profile_pic = Column(String, nullable=True)
    recentlySearch = Column(String, default="")

    __mapper_args__ = {
        "polymorphic_identity": "consumer",
    }
