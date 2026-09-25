@echo off
title SenaMarket - Iniciar Plataforma Completa
echo ======================================================
echo    INICIANDO SENAMARKET (BACKEND + FRONTEND)
echo ======================================================

set "PATH=C:\Program Files\nodejs;%LOCALAPPDATA%\Programs\Python\Python311;%LOCALAPPDATA%\Programs\Python\Python311\Scripts;%PATH%"

echo [1/2] Iniciando Backend FastAPI (http://127.0.0.1:8000)...
start "SenaMarket Backend API" cmd /k "cd /d %~dp0backend && venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Iniciando Frontend React + Vite (http://127.0.0.1:5173)...
start "SenaMarket Frontend Web" cmd /k "cd /d %~dp0frontend && npm.cmd run dev -- --host 127.0.0.1 --port 5173"

echo.
echo Todo listo! Puedes abrir en tu navegador:
echo   - Frontend: http://localhost:5173
echo   - Swagger API Docs: http://127.0.0.1:8000/docs
echo ======================================================
pause
