@echo off
title Srinivasa Dental Care
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-website.ps1"
if errorlevel 1 pause
