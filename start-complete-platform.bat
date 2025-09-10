@echo off
echo 🚀 Starting Complete Accessibility Platform with Task 4...
echo.

echo [1/3] Installing backend dependencies...
cd backend
pip install -r requirements.txt

echo [2/3] Starting Backend API Server (with Authentication + Analytics)...
start "Backend API" cmd /k "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo [3/3] Starting Frontend Development Server...
cd ..\frontend
start "Frontend UI" cmd /k "npm run dev"

echo.
echo ✅ Complete Platform Started Successfully!
echo.
echo 🔗 Frontend UI: http://localhost:3000
echo 🔗 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo 🎯 Task 4 Features:
echo   ✅ User Authentication (JWT)
echo   ✅ Personal Profiles
echo   ✅ Saved Assessment Results
echo   ✅ Persistent Settings
echo   ✅ Analytics Dashboard
echo   ✅ Multi-condition Support
echo.
echo Press any key to exit...
pause > nul