@echo off
echo ===================================================
echo           Starting VendorAI Development Server
echo ===================================================
echo.
cd /d "%~dp0"
echo Starting Vite server on http://localhost:3000 ...
start http://localhost:3000
npm run dev
pause
