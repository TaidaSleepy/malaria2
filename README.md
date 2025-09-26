# Malaria Health Platform

A modern, responsive web application for malaria management, tracking, and community health, built by [TaidaSleepy](https://github.com/TaidaSleepy).

---

## Features

- **Secure Login**  
  - Demo Patient: `patient@gmail.com` / `1234567890`
  - Demo Provider: `doctor@gmail.com` / `1234567890`
- **Role-based Dashboards:**  
  - Patient: Symptom checker, medication scheduling, compliance stats.
  - Provider (Doctor): Register patients, view active patients, manage cases.
  - Community & Admin dashboards: Only available for providers.
- **Medication Scheduler:**  
  - Add, track, and mark medications as taken.
  - See compliance rate and next dose.
- **Symptom Checker:**  
  - Interactive malaria risk assessment.
- **Notifications:**  
  - Visual alerts for actions (add, remove, mark taken, errors).
- **Mobile Friendly:**  
  - Cards, nav, forms, and sections adapt for phones/tablets.
- **Persistent Data:**  
  - Medications and user session stored in `localStorage`.

---

## How It Works

1. **Login Modal:**  
   - Choose your role (Patient or Provider).
   - Enter email and password (use demo accounts).
2. **Navigation:**  
   - Tabs for Home, Symptom Checker, Medication Schedule, Provider Portal, Community Module, Admin Dashboard.
   - Community and Admin dashboards only appear for provider login.
3. **Interactivity:**  
   - All actions update stats and lists instantly.
   - Medication schedule and compliance rates update as you mark doses.
   - Registering a patient increases "Active Patients" stat immediately.

---

## File Overview

- `index.html`  
  Main page. Contains all UI sections and navigation.
- `style.css`  
  Custom theme, base colors, cards, buttons, form, dashboard, mobile responsiveness.
- `script.js`  
  JS logic and UI reactivity.  
  - Handles login, navigation, form actions, patient registration, medication logic, notifications.
  - Code is fully commented for clarity.

---

## How to Run Locally

1. Download or clone this repo (`TaidaSleepy/malaria`).
2. Open `index.html` in your browser.
3. Use demo credentials to log in.

## How to Deploy (GitHub Pages)

1. Push all files to a public repository (e.g. `TaidaSleepy/malaria`).
2. Go to **Settings > Pages**.
3. Set Source to `main` branch, `/root` (if files are in root).
4. Visit your live site at `https://<your-username>.github.io/<repo-name>/`.




