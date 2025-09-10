"""
export.py
Utilities and API endpoints for exporting analytics data as CSV or PDF.
"""

import csv
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from io import StringIO
from .reports import generate_weekly_report, generate_monthly_report, generate_pdf_report
from app.database.database import get_db

router = APIRouter(prefix="/analytics/export", tags=["analytics"])

@router.get("/csv")
def export_csv(report_type: str = "weekly", db: Session = Depends(get_db)):
    """
    Export analytics report as CSV.
    """
    if report_type == "weekly":
        data = generate_weekly_report(db)
    else:
        data = generate_monthly_report(db)
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Metric", "Value"])
    for key, value in data.items():
        writer.writerow([key, value])
    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={report_type}_analytics.csv"
    return response

@router.get("/pdf")
def export_pdf(report_type: str = "weekly", db: Session = Depends(get_db)):
    """
    Export analytics report as PDF.
    """
    if report_type == "weekly":
        data = generate_weekly_report(db)
    else:
        data = generate_monthly_report(db)
    filename = f"{report_type}_analytics.pdf"
    generate_pdf_report(data, filename=filename)
    with open(filename, "rb") as f:
        content = f.read()
    response = Response(content, media_type="application/pdf")
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return response