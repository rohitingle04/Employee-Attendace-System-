# 📌 Smart Faculty Attendance & Batch Management System

A high-security, AI-powered web application designed to automate faculty attendance and batch tracking while eliminating proxy logs using **Face AI**, **GPS Geofencing**, and **Unique Device Tracking**.

## 🚀 Features

🤖 **Face AI Verification** – Uses `TensorFlow.js` (Blazeface) for real-time face proof during Check-Out.  
📍 **GPS Geofencing** – Restricts attendance marking to specific campus coordinates (2km radius).  
🔢 **Multi-Batch Flow** – Systematically manages batch entries from **B1 to B14** in a single session.  
🚫 **Anti-Proxy Protection** – Assigns a unique **Device ID** to each user to prevent duplicate logs.  
🔄 **Real-time Data Sync** – Fetches previous topics and student lists directly from Google Sheets.  
📸 **Black-Photo Fix** – Implemented a **250ms buffer** logic to ensure high-quality, non-blank face captures.  
⚡ **Daily Limit Check** – Automatically prevents users from submitting multiple entries on the same day.  
💻 **Modern UI** – Responsive design with a dynamic particle-line background on HTML5 Canvas.  

## 🛠️ Tech Stack

**Frontend:**
* HTML5 & CSS3
* JavaScript (ES6+)
* TensorFlow.js (AI Engine)
* Canvas API (Animations)

**Backend / Integration:**
* Google Apps Script (Serverless Web App)
* Google Sheets (Real-time Database)

**Concepts Used:**
* Blazeface AI Model Implementation
* Geolocation API Integration
* Local Storage & Device Fingerprinting
* Asynchronous API Handling (Fetch / Promises)

```
 ⚙️ How It Works

1.  **Faculty Check-In:** System validates email and unique Device ID to check today's status.
2.  **Batch Processing:** Faculty moves through batches (B1-B14), entering topics and viewing synced student lists.
3.  **Location Verification:** Before Check-Out, the system verifies the user's GPS coordinates.
4.  **Face Proof:** If location is verified, Face AI captures a mirror-corrected photo with a 250ms delay fix.
5.  **Secure Submission:** All data is sent to Google Sheets in real-time via a secure POST request.

## 📂 Project Structure

```
Faculty-Attendance-System/
│── index.html       # Main Dashboard, Animations & AI Logic
│── success.html     # Attendance Confirmation Page
│── assets/          # Project Icons & Images
└── README.md        # Documentation

```
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
