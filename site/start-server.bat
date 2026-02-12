@echo off
TITLE NovaSight Solutions Server
COLOR 0A

echo ========================================
echo    NovaSight Solutions - Quick Server
echo ========================================
echo.

REM Change to the directory where this batch file is located
cd /d "%~dp0"

echo Starting server at: http://localhost:8000
echo Admin panel: http://localhost:8000/admin/
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try python launcher first, then python
py -m http.server 8000
if errorlevel 1 (
    python -m http.server 8000
    if errorlevel 1 (
        echo.
        echo [ERROR] Python is not installed or not in PATH!
        echo Please install Python from https://www.python.org/downloads/
        echo.
        pause
    )
)

pause