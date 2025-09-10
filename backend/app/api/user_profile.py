from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User, Assessment, UserPreferences
from app.auth.auth_routes import get_current_user
from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

router = APIRouter()

class AssessmentSave(BaseModel):
    assessment_type: str  # dyslexia, adhd, vision
    results: Dict[str, Any]

class PreferencesUpdate(BaseModel):
    dyslexia_settings: Optional[Dict[str, Any]] = {}
    adhd_settings: Optional[Dict[str, Any]] = {}
    vision_settings: Optional[Dict[str, Any]] = {}
    tts_preferences: Optional[Dict[str, Any]] = {}

class UserDashboard(BaseModel):
    user_info: Dict[str, Any]
    assessments: Dict[str, Any]
    preferences: Dict[str, Any]
    progress_summary: Dict[str, Any]

@router.post("/save-assessment")
async def save_assessment(
    assessment_data: AssessmentSave,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save assessment results to user profile"""
    
    # Check if assessment already exists for this user and type
    existing = db.query(Assessment).filter(
        Assessment.user_id == current_user.id,
        Assessment.assessment_type == assessment_data.assessment_type
    ).first()
    
    if existing:
        # Update existing assessment
        existing.results = assessment_data.results
        existing.timestamp = datetime.utcnow()
    else:
        # Create new assessment
        new_assessment = Assessment(
            user_id=current_user.id,
            assessment_type=assessment_data.assessment_type,
            results=assessment_data.results
        )
        db.add(new_assessment)
    
    try:
        db.commit()
        return {"message": "Assessment saved successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save assessment: {str(e)}")

@router.get("/assessments")
async def get_user_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all assessments for current user"""
    assessments = db.query(Assessment).filter(Assessment.user_id == current_user.id).all()
    
    result = {}
    for assessment in assessments:
        result[assessment.assessment_type] = {
            "results": assessment.results,
            "timestamp": assessment.timestamp,
            "id": assessment.id
        }
    
    return result

@router.post("/preferences")
async def update_preferences(
    preferences: PreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user accessibility preferences"""
    
    # Check if preferences exist
    user_prefs = db.query(UserPreferences).filter(
        UserPreferences.user_id == current_user.id
    ).first()
    
    if user_prefs:
        # Update existing preferences
        if preferences.dyslexia_settings:
            user_prefs.dyslexia_settings = preferences.dyslexia_settings
        if preferences.adhd_settings:
            user_prefs.adhd_settings = preferences.adhd_settings
        if preferences.vision_settings:
            user_prefs.vision_settings = preferences.vision_settings
        if preferences.tts_preferences:
            user_prefs.tts_preferences = preferences.tts_preferences
        user_prefs.updated_at = datetime.utcnow()
    else:
        # Create new preferences
        user_prefs = UserPreferences(
            user_id=current_user.id,
            dyslexia_settings=preferences.dyslexia_settings,
            adhd_settings=preferences.adhd_settings,
            vision_settings=preferences.vision_settings,
            tts_preferences=preferences.tts_preferences
        )
        db.add(user_prefs)
    
    try:
        db.commit()
        return {"message": "Preferences updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update preferences: {str(e)}")

@router.get("/preferences")
async def get_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user accessibility preferences"""
    user_prefs = db.query(UserPreferences).filter(
        UserPreferences.user_id == current_user.id
    ).first()
    
    if not user_prefs:
        return {
            "dyslexia_settings": {},
            "adhd_settings": {},
            "vision_settings": {},
            "tts_preferences": {}
        }
    
    return {
        "dyslexia_settings": user_prefs.dyslexia_settings,
        "adhd_settings": user_prefs.adhd_settings,
        "vision_settings": user_prefs.vision_settings,
        "tts_preferences": user_prefs.tts_preferences,
        "updated_at": user_prefs.updated_at
    }

@router.get("/dashboard", response_model=UserDashboard)
async def get_user_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get complete user dashboard data"""
    
    # Get assessments
    assessments = db.query(Assessment).filter(Assessment.user_id == current_user.id).all()
    assessment_data = {}
    for assessment in assessments:
        assessment_data[assessment.assessment_type] = {
            "results": assessment.results,
            "timestamp": assessment.timestamp
        }
    
    # Get preferences
    user_prefs = db.query(UserPreferences).filter(
        UserPreferences.user_id == current_user.id
    ).first()
    
    preferences_data = {}
    if user_prefs:
        preferences_data = {
            "dyslexia_settings": user_prefs.dyslexia_settings,
            "adhd_settings": user_prefs.adhd_settings,
            "vision_settings": user_prefs.vision_settings,
            "tts_preferences": user_prefs.tts_preferences
        }
    
    # Calculate progress summary
    conditions_detected = len(assessment_data)
    progress_summary = {
        "assessments_completed": conditions_detected,
        "conditions_detected": [k for k, v in assessment_data.items() if v["results"].get("severity", "normal") != "normal"],
        "last_activity": max([a["timestamp"] for a in assessment_data.values()]) if assessment_data else None
    }
    
    return UserDashboard(
        user_info={
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "created_at": current_user.created_at
        },
        assessments=assessment_data,
        preferences=preferences_data,
        progress_summary=progress_summary
    )