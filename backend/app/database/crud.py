from sqlalchemy.orm import Session
from .models import User, Assessment, Progress

# --- User CRUD ---
def create_user(db: Session, email: str, password_hash: str, preferences: dict = None):
    user = User(email=email, password_hash=password_hash, preferences=preferences or {})
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def update_user(db: Session, user_id: int, **kwargs):
    user = get_user(db, user_id)
    for key, value in kwargs.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    db.delete(user)
    db.commit()

# --- Assessment CRUD ---
def create_assessment(db: Session, user_id: int, type: str, results: dict):
    assessment = Assessment(user_id=user_id, type=type, results=results)
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment

def get_assessment(db: Session, assessment_id: int):
    return db.query(Assessment).filter(Assessment.id == assessment_id).first()

def update_assessment(db: Session, assessment_id: int, **kwargs):
    assessment = get_assessment(db, assessment_id)
    for key, value in kwargs.items():
        setattr(assessment, key, value)
    db.commit()
    db.refresh(assessment)
    return assessment

def delete_assessment(db: Session, assessment_id: int):
    assessment = get_assessment(db, assessment_id)
    db.delete(assessment)
    db.commit()

# --- Progress CRUD ---
def create_progress(db: Session, user_id: int, metrics: dict):
    progress = Progress(user_id=user_id, metrics=metrics)
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress

def get_progress(db: Session, progress_id: int):
    return db.query(Progress).filter(Progress.id == progress_id).first()

def update_progress(db: Session, progress_id: int, **kwargs):
    progress = get_progress(db, progress_id)
    for key, value in kwargs.items():
        setattr(progress, key, value)
    db.commit()
    db.refresh(progress)
    return progress

def delete_progress(db: Session, progress_id: int):
    progress = get_progress(db, progress_id)
    db.delete(progress)
    db.commit()