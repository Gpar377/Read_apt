from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    preferences = Column(JSON)

    assessments = relationship("Assessment", back_populates="user")
    progresses = relationship("Progress", back_populates="user")

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    results = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="assessments")

class Progress(Base):
    __tablename__ = "progresses"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    metrics = Column(JSON)
    date_recorded = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="progresses")