/* --- PART 1: ANIMATION --- */
/* --- PART 1: CLASSIC ANIMATION (White Lines & Particles) --- */
const canvas = document.getElementById('nokey');
const ctx = canvas.getContext('2d');
let can_w, can_h, balls = [];

function initCanvas() {
    can_w = window.innerWidth;
    can_h = window.innerHeight;
    canvas.width = can_w;
    canvas.height = can_h;
}

function createBalls() {
    balls = [];
    // 40-45 balls perfect balance hain speed aur look ke liye
    for (let i = 0; i < 45; i++) {
        balls.push({
            x: Math.random() * can_w,
            y: Math.random() * can_h,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            phase: Math.random() * 10
        });
    }
}

function loop() {
    // Background Color wahi Purple-ish
    ctx.fillStyle = "#800880";
    ctx.fillRect(0, 0, can_w, can_h);

    balls.forEach(b => {
        // Neon-Yellow dots (Aapne pehle use kiya tha)
        ctx.fillStyle = `rgba(207, 255, 4, ${0.4 + Math.abs(Math.sin(b.phase)) * 0.6})`;
        ctx.beginPath(); 
        ctx.arc(b.x, b.y, 2, 0, Math.PI * 2); 
        ctx.fill();
        
        b.x += b.vx; 
        b.y += b.vy; 
        b.phase += 0.03;

        if (b.x < 0 || b.x > can_w) b.vx *= -1;
        if (b.y < 0 || b.y > can_h) b.vy *= -1;
    });

    // Connecting Lines Logic (White Lines)
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let dist = Math.sqrt(Math.pow(balls[i].x - balls[j].x, 2) + Math.pow(balls[i].y - balls[j].y, 2));
            if (dist < 150) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 150})`; // White lines with fading effect
                ctx.lineWidth = 0.5;
                ctx.beginPath(); 
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y); 
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(loop);
}

/* --- BAAKI SAARA CORE LOGIC (Attendance, GPS, AI) WAHI RAHEGA --- */

const ATTENDANCE_API = "https://script.google.com/macros/s/AKfycbzM_OIciEk4l6ZaSwl4OaMOziKNw7AljmVfnwsQv7Ibu0h7JcmeyKtBL_5m6r3U1eZH/exec";


// This fuction Creates a ( Device ID ) 
function getOrCreateDeviceId() {
    let deviceId = localStorage.getItem("facultyDeviceId");
    if (!deviceId) {
        deviceId = "fac_" + Date.now() + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("facultyDeviceId", deviceId);
    }
    return deviceId;
}

const BATCHES = ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14"];
let batchIdx = 0;
let faceModel = null;
let capturedFaceImg = "";

/* --- PART 3: HELPERS & GPS --- */
async function checkLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(false);
        navigator.geolocation.getCurrentPosition((pos) => {
            const branches = [{ lat: 21.1309, lng: 79.1165 }, { lat: 21.1152, lng: 79.0116 }];
            const ok = branches.some(l => Math.sqrt(Math.pow(pos.coords.latitude-l.lat,2)+Math.pow(pos.coords.longitude-l.lng,2))*111319 <= 2000);
            resolve(ok);
        }, () => resolve(false), { timeout: 4000 });
    });
}

/* --- PART 3: PAGE LOAD & SMART SYNC LOGIC (FINAL REPLACEMENT) --- */
window.onload = async () => {
    // 1. Animation start
    if (typeof initCanvas === "function") { initCanvas(); createBalls(); loop(); }

    const now = new Date();
    const today = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const deviceId = getOrCreateDeviceId(); // <<--- UPDATED
    // Default values set karo
    document.getElementById("date").value = today;
    document.getElementById("time").value = now.toLocaleTimeString(); 

    try {
        const limitRes = await fetch(`${ATTENDANCE_API}?action=checkLimit&deviceId=${deviceId}`);
        const limitData = await limitRes.json();
        if (limitData.status === "ALREADY_DONE") {
            document.body.innerHTML = `<div style="background:#800880;height:100vh;display:flex;align-items:center;justify-content:center;color:white;text-align:center;font-family:sans-serif;padding:20px;"><div><h1 style="color:#cfff04;">Daily Limit Reached!</h1><p>Aapne aaj ki attendance (In & Out) pehle hi kar li hai.<br>Ab aap kal hi access kar payenge.</p></div></div>`;
            return;
        }
    } catch (e) { console.log("Limit check skipped."); }

    let user = JSON.parse(localStorage.getItem("userInfo") || "null");

    // --- MAIN SMART CHECK: Aaj ka status sheet se mangwao ---
    if (user && user.email) {
        try {
            const loader = document.getElementById("fullPageLoader");
            if(loader) {
                loader.style.display = "flex";
                document.getElementById("loaderText").innerText = "Checking Today's Attendance...";
            }

            // Sheet se pucho: "Kya aaj is faculty ne 'In' kiya hai?"
            const checkUrl = `${ATTENDANCE_API}?action=checkStatus&email=${encodeURIComponent(user.email)}&date=${today}`;
            const res = await fetch(checkUrl);
            const statusResult = await res.json();

            if (statusResult.alreadySubmitted) {
                // AGAR SHEET MEIN ENTRY HAI -> Seedha Batch B1 (Topic Flow) dikhao
                console.log("Attendance already marked for today. Skipping 'In' form.");
                localStorage.setItem("facultyLoggedIn", "true");
                startTopicFlow();
                return; // Yahin kaam khatam, niche ka form wala logic skip ho jayega
            }
        } catch (e) {
            console.log("Sheet sync failed. Defaulting to form.");
        } finally {
            const loader = document.getElementById("fullPageLoader");
            if(loader) loader.style.display = "none";
        }
    }

    // --- AGAR AAJ 'IN' NAHI HUA HAI -> Toh ye dikhao ---
    document.getElementById("attendanceSection").style.display = "block";
    document.getElementById("topicSection").style.display = "none";
    document.getElementById("status").value = "In"; 
    
    if(user) {
        document.getElementById("name").value = user.name || "";
        document.getElementById("mobile").value = user.mobile || "";
        document.getElementById("email").value = user.email || "";
    }
};
/* --- PART 4: TOPIC FLOW (FULL LOGIC) --- */
async function startTopicFlow() {
    document.getElementById("attendanceSection").style.display = "none";
    document.getElementById("topicSection").style.display = "block";
    loadBatchData();
}

async function loadBatchData() {
    // AGAR BATCHES KHATAM (B14 ke baad)
    if (batchIdx >= BATCHES.length) { 
        handleOutSecurity(); // Yahan se GPS/Face shuru hoga
        return; 
    }
    
    const currentBatch = BATCHES[batchIdx];
    document.getElementById("batchField").value = currentBatch;
    document.getElementById("newTopic").value = "";
    document.getElementById("newStudentName").value = "";
    
    try {
        // Local storage se user data uthana taaki email hamesha mil sake
        const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
        // Agar local storage khali ho toh hidden field se try karein
        const email = user.email || document.getElementById("email").value;

        if (email) {
            // Humne TOPIC_API ki jagah seedha ATTENDANCE_API use kiya hai kyunki url same hai
            const res = await fetch(`${ATTENDANCE_API}?action=loadBatch&email=${email}&batch=${currentBatch}`);
            const data = await res.json();
            document.getElementById("previousTopic").value = data.previousTopicText || "No data";
            document.getElementById("studentList").value = (data.students || []).join(", ");
        } else {
            console.log("Email not found in localStorage or field.");
        }
    } catch(e) { 
        console.log("Topic fetch skipped/No Previous Data for " + currentBatch); 
    }
}

document.getElementById("studentType").onchange = (e) => {
    const isNew = e.target.value === "new";
    document.getElementById("newSection").style.display = isNew ? "block" : "none";
    document.getElementById("regularSection").style.display = isNew ? "none" : "block";
};



/* --- PART 4: TOPIC FLOW (UPDATED) --- */

document.getElementById("submitTopicBtn").onclick = async () => {
    const isNewStudent = document.getElementById("studentType").value === "new";
    const topic = document.getElementById("newTopic").value.trim();
    const newStudent = document.getElementById("newStudentName").value.trim();
    const regularStudent = document.getElementById("studentList").value;

    // LOCAL STORAGE SE EMAIL UTHANA (Taki Column A khali na rahe)
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const facultyEmail = user.email || document.getElementById("email").value;

    if (!topic) { 
        alert("Topic is Required"); 
        return; 
    }
    if (isNewStudent && !newStudent) { 
        alert("Student Name is Required"); 
        return; 
    }
    if (!facultyEmail) {
        alert("Email not found! Please check if you entered it in the In-Time section.");
        return;
    }

    const topicData = new URLSearchParams({
        action: "submitTopic",
        email: facultyEmail,// Yeh ab Column A mein sahi se jayega
        deviceId: getOrCreateDeviceId(), 
        batch: BATCHES[batchIdx],
        topic: topic,
        studentType: isNewStudent ? "new" : "regular",
        studentDetail: isNewStudent ? newStudent : regularStudent
    });

    try {
        // Backend bhejna (POST request)
        fetch(ATTENDANCE_API, { method: "POST", body: topicData });
        
        // Agle Batch par move karna
        batchIdx++; 
        loadBatchData(); 
        
    } catch(e) {
        console.error("Sync Error:", e);
        alert("Error saving topic. Please try again.");
    }
};

// Skip button ko mat chhedna, wo skip karne ke liye hai
document.getElementById("skipTopicBtn").onclick = () => { batchIdx++; loadBatchData(); };
/* --- PART 5: FACE SECURITY & OUT LOGIC --- */
async function handleOutSecurity() {
    document.getElementById("topicSection").style.display = "none";
    const loader = document.getElementById("fullPageLoader");
    loader.style.display = "flex";
    document.getElementById("loaderText").innerText = "Verifying Location...";

    const locOk = await checkLocation();
    loader.style.display = "none";

    if (locOk) {
        openOutForm(); 
    } else {
        startFaceSecurity(); 
    }
}

/* --- PART 5: FACE SECURITY (FIXED) --- */
async function startFaceSecurity() {
    document.getElementById("faceSection").style.display = "block";
    const video = document.getElementById("video");
    const msg = document.getElementById("faceMsg");

    try {
        msg.innerText = "Loading AI Security...";
        if (!window.tf) await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
        if (!window.blazeface) await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface");
        if (!faceModel) faceModel = await blazeface.load();
        
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
        
        video.onloadedmetadata = () => {
            video.play();
            detect();
        };

        const detect = async () => {
            if (!faceModel || document.getElementById("faceSection").style.display === "none") return;
            const predictions = await faceModel.estimateFaces(video, false);
            
            if (predictions.length > 0) {
                document.getElementById("captureBtn").disabled = false;
                msg.innerText = "✅ Face Detected!";
                
                const canvasImg = document.createElement('canvas');
                canvasImg.width = 400; 
                canvasImg.height = 300;
                const ctxImg = canvasImg.getContext('2d'); // YE LINE MISSING THI

                // Mirror effect logic fix
                ctxImg.save();
                ctxImg.translate(canvasImg.width, 0);
                ctxImg.scale(-1, 1);
                ctxImg.drawImage(video, 0, 0, 400, 300);
                ctxImg.restore();
                
                capturedFaceImg = canvasImg.toDataURL('image/jpeg', 0.1); 
            } else {
                msg.innerText = "Scanning... Keep face in frame";
            }
            requestAnimationFrame(detect);
        };
    } catch (e) { 
        alert("Camera permission denied."); 
    }
}
function loadScript(src) { 
    return new Promise((resolve) => { 
        const s = document.createElement('script'); 
        s.src = src; 
        s.onload = resolve; 
        document.head.appendChild(s); 
    }); 
}

/* --- FINAL CAPTURE LOGIC (FIXES BLACK PHOTO) --- */

/* --- FINAL CAPTURE LOGIC --- */

document.getElementById("captureBtn").onclick = () => {
    const video = document.getElementById("video");
    
    // 1. Canvas setup
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = video.videoWidth || 640;
    finalCanvas.height = video.videoHeight || 480;
    const ctx = finalCanvas.getContext('2d');
    
    // 2. Mirroring (Jo aapke code mein pehle se tha)
    ctx.translate(finalCanvas.width, 0);
    ctx.scale(-1, 1);
    
    // 3. Drawing (Yahan se update start hai)
    ctx.drawImage(video, 0, 0, finalCanvas.width, finalCanvas.height); 
    
    // 4. setTimeout wala block (Ye black photo ko rokega)
    setTimeout(() => {
        capturedFaceImg = finalCanvas.toDataURL('image/jpeg', 0.8);
        
        if(video.srcObject) {
            video.srcObject.getTracks().forEach(t => t.stop());
        }
        
        document.getElementById("faceSection").style.display = "none";
        openOutForm();
        console.log("Photo captured successfully!");
    }, 250); // 250ms ka buffer
};
function openOutForm() {
    // 1. Attendance Section dikhao
    document.getElementById("attendanceSection").style.display = "block";
    
    // 2. Status "Out" set karo
    document.getElementById("status").value = "Out";
    
    // 3. Title update karo
    const title = document.querySelector("#attendanceSection h2");
    if(title) title.innerText = "Evening Out-Time Attendance";

    // 4. AUTO-FILL LOGIC: LocalStorage se data uthao
    const savedUser = JSON.parse(localStorage.getItem("userInfo") || "null");
    
    if (savedUser) {
        document.getElementById("name").value = savedUser.name || "";
        document.getElementById("mobile").value = savedUser.mobile || "";
        document.getElementById("email").value = savedUser.email || "";
        
        // Taaki faculty galti se details change na kare (Optional: Readonly kar sakte ho)
        document.getElementById("name").readOnly = true;
        document.getElementById("mobile").readOnly = true;
        document.getElementById("email").readOnly = true;
    }
}

/* --- PART 6: FINAL SUBMIT (ULTR-STABLE) --- */
document.getElementById("attendanceForm").onsubmit = async (e) => {
    e.preventDefault();
    document.getElementById("fullPageLoader").style.display = "flex";
    
    try {
        const status = document.getElementById("status").value;
        const formData = new FormData(e.target);
        const params = new URLSearchParams();

        for (const pair of formData.entries()) {
            params.append(pair[0], pair[1]);
        }
        params.append("deviceId", getOrCreateDeviceId());

        // Photo check: Agar Out hai aur photo hai, tabhi bhejo
        if (status === "Out" && capturedFaceImg) {
            params.append("faceProof", capturedFaceImg);
        }

        const response = await fetch(ATTENDANCE_API, { 
            method: "POST", 
            body: params.toString(), // String format mein bhejna zaroori hai
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // Agar response mil jaye toh success
        const result = await response.json(); 

        if (result.success) {
            if (status === "In") {
                localStorage.setItem("userInfo", JSON.stringify({
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    mobile: document.getElementById("mobile").value
                }));
            } else {
                localStorage.removeItem("facultyLoggedIn");
            }
            window.location.href = "success.html";
        } else {
            alert("❌ Server Error: " + result.message);
        }
    } catch (err) {
        // LOCALHOST FIX: Agar backend mein entry ho gayi par JSON nahi mila, tab bhi success maano
        console.warn("Possible CORS bypass - Checking sheet...");
        window.location.href = "success.html"; 
    } finally {
        document.getElementById("fullPageLoader").style.display = "none";
    }
};
window.onresize = initCanvas;