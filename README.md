# 📌 Smart Faculty Attendance & Batch Management System

A high-security, AI-powered web application designed to automate faculty attendance and batch tracking while eliminating proxy logs using Face AI, GPS Geofencing, and Unique Device IDs.

## 🚀 Features

🤖 **Face AI Verification** – Uses TensorFlow.js (Blazeface) for real-time face proof during Check-Out.
📍 **Geofencing & GPS** – Restricts attendance marking to specific campus coordinates (2km radius).
🔢 **Batch-wise Tracking** – Systematically manages batch entries from **B1 to B14** in a single session.
🚫 **Anti-Proxy Protection** – Prevents duplicate submissions using unique Device ID tracking.
🔄 **Real-time Data Sync** – Fetches previous topics and student lists directly from Google Sheets.
📸 **Black-Photo Fix** – Implements a 250ms buffer to ensure high-quality, non-blank face captures.
💻 **Modern UI** – Interactive particle-line animation background built on HTML5 Canvas.

## 🛠️ Tech Stack

**Frontend:**
* HTML5 & CSS3
* JavaScript (ES6+)
* TensorFlow.js (AI Engine)
* Canvas API (Animations)

**Backend / Integration:**
* Google Apps Script (Serverless API)
* Google Sheets (Database)

**Concepts Used:**
* Blazeface AI Model
* Geolocation API
* Local Storage & Device Fingerprinting
* Asynchronous API Handling (Fetch)

## ⚙️ How It Works

1.  **Faculty Check-In:** System validates email and device ID to check if attendance is already marked.
2.  **Batch Entry:** Faculty moves through batches (B1-B14), entering topics and viewing synced student data.
3.  **Security Check:** Before Check-Out, the system verifies the GPS location.
4.  **Face Capture:** If location is verified, Face AI triggers and captures a photo with a mirror-correction fix.
5.  **Secure Submission:** All data is sent to Google Sheets in real-time via Google Apps Script.

## 📂 Project Structure

Faculty-Attendance-System/
│── index.html       # Main Dashboard & AI Logic
│── success.html     # Confirmation Page
│── assets/          # Icons and Images
└── README.md        # Documentation

## 🔥 Key Highlights

✅ **Prevents Proxy Attendance** using mandatory Face AI and GPS verification.
✅ **250ms Buffer Logic** ensuring no black/blank photos are captured.
✅ **Seamless Batch Flow** designed specifically for faculty lecture schedules.
✅ **Zero Server Cost** architecture using Google Workspace as a backend.


---

## 💡 Future Enhancements

- Admin dashboard for real-time faculty analytics.
- Automated email reports for daily attendance summary.
- Progressive Web App (PWA) support for offline usage.

---

⭐ **If you like this project, don't forget to star the repository!** ⭐
