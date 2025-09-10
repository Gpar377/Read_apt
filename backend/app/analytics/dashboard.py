"""
dashboard.py
Aggregates analytics for the admin dashboard. Exposes FastAPI router.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from .metrics import (
    get_reading_speed_improvements,
    get_assessment_completion_rate,
    get_real_time_stats,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
def dashboard_overview(db: Session = Depends(get_db)):
    """
    Returns a summary of platform analytics for the admin dashboard.
    """
    speed_improvements = get_reading_speed_improvements(db)
    completion_rates = get_assessment_completion_rate(db)
    real_time = get_real_time_stats(db)
    return {
        "reading_speed_improvements": speed_improvements,
        "assessment_completion": completion_rates,
        "real_time": real_time,
    }