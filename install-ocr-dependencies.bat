@echo off
echo 🔧 Installing OCR Dependencies...
echo.

echo [1/3] Installing Python OCR packages...
cd backend
pip install pytesseract==0.3.10 Pillow==10.1.0

echo [2/3] Installing Tesseract OCR Engine...
echo Please download and install Tesseract from:
echo https://github.com/UB-Mannheim/tesseract/wiki
echo.
echo Default installation path: C:\Program Files\Tesseract-OCR\tesseract.exe
echo.

echo [3/3] Installing Frontend dependencies...
cd ..\frontend
npm install react-dropzone@^14.2.3

echo.
echo ✅ OCR Dependencies Installation Complete!
echo.
echo 📋 Next Steps:
echo   1. Install Tesseract OCR from the link above
echo   2. Restart the platform using start-complete-platform.bat
echo   3. Visit http://localhost:3000/ocr to test OCR functionality
echo.
echo Press any key to exit...
pause > nul