@echo off
title Srinivasa Dental Care
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop-website.ps1"
timeout /t 3 >nul
