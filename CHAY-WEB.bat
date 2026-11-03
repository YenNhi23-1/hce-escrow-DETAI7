@echo off
chcp 65001 >nul
title HUE Credentials - May Chu Web3 Localhost (Port 3000)
cd /d "%~dp0"

echo ========================================================
echo   KHOI CHAY HE THONG VAN BANG SO DAI HOC HUE
echo ========================================================
echo.
echo [*] Dang khoi dong may chu Web3 tai: http://localhost:3000
echo [*] Dang mo trinh duyet...
echo.
echo [!] QUAN TRONG: VUI LONG KHONG TAT CUA SO NAY!
echo     (Dong cua so nay se lam mat ket noi localhost)
echo ========================================================
echo.

start http://localhost:3000

node server.js
if %errorlevel% neq 0 (
    echo.
    echo [THONG BAO] Dang thu chuyen sang Python...
    python -m http.server 3000 --directory web
)

pause
