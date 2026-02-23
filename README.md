# 🚀 Smart Faculty Attendance & Batch Tracker

A high-security, serverless attendance portal designed for educational institutes. This system automates faculty check-ins and check-outs while preventing proxy attendance using **AI Face Verification**, **GPS Geofencing**, and **Unique Device IDs**.

---

## ✨ Key Features

* **🤖 AI Face Verification:** Integrated `TensorFlow.js` (Blazeface model) to ensure physical presence by capturing a real-time face proof during Check-Out.
* **📍 GPS Geofencing:** Restricts attendance marking to specific campus coordinates (2km radius) to ensure staff are on-site.
* **🔢 Multi-Batch Flow:** Systematically handles batch entries from **B1 to B14** in a single session, making it easy for faculty to log their entire day.
* **🛡️ Device ID Tracking:** Assigns a unique ID to each device to prevent multiple users from using the same phone/laptop for proxy logs.
* **🔄 Live Batch Sync:** Fetches existing student lists and previous lecture topics directly from Google Sheets for a seamless experience.
* **🎨 Interactive UI:** Features a modern, dynamic particle-line background built on HTML5 Canvas.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **AI Engine:** TensorFlow.js / Blazeface
* **Backend:** Google Apps Script (GAS)
* **Database:** Google Sheets (Serverless Architecture)
* **Animation:** HTML5 Canvas API

---

## ⚙️ How It Works (Project Logic)

1.  **Check-In (In-Time):** Faculty logs in; the system validates their email and checks if they have already submitted attendance for the day.
2.  **Batch Entry:** Faculty navigates through batches (B1-B14). The app pulls data from the "Student Data" sheet to show current class info.
3.  **Out-Time Security:** Before final submission:
    * System verifies **GPS location**.
    * If location or security requires, the **AI Face Camera** triggers.
    * A mirror-corrected photo is captured with a **250ms buffer** to prevent black-screen/blank image errors.
4.  **Data Export:** All data (including the face proof and device fingerprint) is sent to Google Sheets via a secure POST request.

---

## 🚀 Setup & Installation

### 1. Google Sheets Backend
1.  Create a Google Sheet with headers: `Timestamp`, `Name`, `Email`, `Mobile`, `Status`, `Batch`, `Topic`, `Student Details`, `Device ID`, and `Face Proof`.
2.  Go to `Extensions > Apps Script` and paste the backend `Code.gs` logic.
3.  Deploy as a **Web App** (Set Access to: "Anyone").
4.  Copy the generated **Web App URL**.

### 2. Frontend Integration
1.  Open `index.html` or your main JS file.
2.  Find the constant `ATTENDANCE_API`.
3.  Replace the placeholder URL with your **Google Web App URL**.

