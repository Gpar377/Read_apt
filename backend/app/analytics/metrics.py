"""
metrics.py
Core analytics/statistics functions for user progress and performance metrics.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Float
from datetime import datetime, timedelta

from app.database.models import User, Assessment, Progress

def get_reading_speed_improvements(db: Session, user_id: int = None, period_days: int = 30):
    """
    Returns avg reading speed improvement per user (or all users) for the given period.
    Assumes 'reading_speed' is stored in Assessment.results JSON.
    """
    # Postgres syntax for extracting JSON - adjust for your DB
    # Example for Postgres: Assessment.results['reading_speed'].astext.cast(Float)
    query = db.query(
        Assessment.user_id,
        func.avg(
            cast(Assessment.results['reading_speed'].astext, Float)
        ).label('avg_speed')
    ).filter(
        Assessment.timestamp >= datetime.utcnow() - timedelta(days=period_days)
    )
    if user_id:
        query = query.filter(Assessment.user_id == user_id)
    results = query.group_by(Assessment.user_id).all()
    return [{"user_id": row.user_id, "avg_speed": row.avg_speed} for row in results]

def get_assessment_completion_rate(db: Session, period_days: int = 30):
    """
    Returns assessment completion rate over the given period.
    """
    total = db.query(func.count(Assessment.id)).scalar() or 1
    period_total = db.query(func.count(Assessment.id)).filter(
        Assessment.timestamp >= datetime.utcnow() - timedelta(days=period_days)
    ).scalar() or 0
    return {"total": total, "completed_in_period": period_total, "rate": period_total / total}

def get_weekly_monthly_progress(db: Session, user_id: int):
    """
    Returns weekly and monthly progress for the user from the Progress table.
    """
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    week = db.query(func.avg(cast(Progress.metrics['reading_speed'].astext, Float))).filter(
        Progress.user_id == user_id,
        Progress.date_recorded >= week_ago
    ).scalar()
    month = db.query(func.avg(cast(Progress.metrics['reading_speed'].astext, Float))).filter(
        Progress.user_id == user_id,
        Progress.date_recorded >= month_ago
    ).scalar()
    return {"weekly_avg": week, "monthly_avg": month}

def get_real_time_stats(db: Session):
    """
    Returns real-time stats: active users today, assessments today.
    ('last_active' not present in your User model, so we count today's new users)
    """
    today = datetime.utcnow().date()
    # Users created today (as proxy for activity)
    active_users = db.query(User.id).filter(
        func.date(User.created_at) == today
    ).count()
    assessments_today = db.query(Assessment.id).filter(
        func.date(Assessment.timestamp) == today
    ).count()
    return {
        "active_users": active_users,
        "assessments_today": assessments_today
    }