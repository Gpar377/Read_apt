"""
reports.py
Generates detailed analytics reports (weekly/monthly) and supports PDF output.
"""

from sqlalchemy.orm import Session
from .metrics import (
    get_reading_speed_improvements,
    get_assessment_completion_rate,
)

try:
    from reportlab.pdfgen import canvas
except ImportError:
    canvas = None

def generate_weekly_report(db: Session):
    """
    Returns weekly analytics data.
    """
    return {
        "reading_speed": get_reading_speed_improvements(db, period_days=7),
        "assessment_completion": get_assessment_completion_rate(db, period_days=7),
    }

def generate_monthly_report(db: Session):
    """
    Returns monthly analytics data.
    """
    return {
        "reading_speed": get_reading_speed_improvements(db, period_days=30),
        "assessment_completion": get_assessment_completion_rate(db, period_days=30),
    }

def generate_pdf_report(report_data, filename="report.pdf"):
    """
    Generates a PDF report from analytics data.
    """
    if canvas is None:
        raise ImportError("reportlab is required for PDF export")
    c = canvas.Canvas(filename)
    y = 800
    c.drawString(100, y, "Analytics Report")
    y -= 40
    for section, data in report_data.items():
        c.drawString(100, y, f"{section.title()}:")
        y -= 20
        c.drawString(120, y, str(data))
        y -= 40
    c.save()
    return filename