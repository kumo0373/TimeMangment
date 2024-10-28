let timer; // لتخزين المؤقت
let workTime = 25; // 25 دقيقة
let breakTime = 5; // 5 دقائق
let timeLeft = workTime * 60; // تحويل الدقائق إلى ثواني
let isTimerRunning = false; // حالة المؤقت
let isBreakTime = false; // حالة الاستراحة

const statsButton = document.getElementById("statsButton");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const workTimeInput = document.getElementById("workTime");
const breakTimeInput = document.getElementById("breakTime");

// طلب الإذن للإشعارات
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// فتح صفحة الإحصائيات عند الضغط على الزر
statsButton.addEventListener("click", () => {
    window.location.href = "statistics.html"; // الانتقال إلى صفحة الإحصائيات
});

// تحديث عرض الوقت
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// تشغيل صوت التنبيه
function playAlarmSound() {
    const audio = new Audio('alarm.wav'); // تأكد من تعديل المسار إلى ملف الصوت الصحيح
    audio.play();
}

// إظهار الإشعار
function notifyUser(message) {
    if (Notification.permission === "granted") {
        new Notification(message);
    }
}

// بدء تشغيل المؤقت
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;

        // الحصول على أوقات العمل والاستراحة من المدخلات
        workTime = parseInt(workTimeInput.value) || 25; // استخدام 25 إذا كانت القيمة غير صالحة
        breakTime = parseInt(breakTimeInput.value) || 5; // استخدام 5 إذا كانت القيمة غير صالحة

        // تعيين الوقت المتبقي وفقًا للحالة
        timeLeft = isBreakTime ? (breakTime * 60) : (workTime * 60); // تحويل الدقائق إلى ثواني

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timer); // إيقاف المؤقت عندما ينتهي الوقت
                isTimerRunning = false;
                playAlarmSound(); // تشغيل صوت التنبيه

                if (!isBreakTime) {
                    // الانتقال إلى فترة الاستراحة
                    isBreakTime = true; // تغيير الحالة إلى الاستراحة
                    notifyUser("وقت العمل انتهى! حان وقت الاستراحة.");
                    updateStatistics(); // تحديث الإحصائيات عند انتهاء الجلسة
                } else {
                    // العودة إلى العمل بعد فترة الاستراحة
                    isBreakTime = false; // العودة إلى حالة العمل
                    notifyUser("وقت الاستراحة انتهى! حان وقت العمل.");
                    updateStatistics(); // تحديث الإحصائيات عند انتهاء الجلسة
                }
                
                startTimer(); // بدء المؤقت مرة أخرى لفترة العمل أو الاستراحة
            }
        }, 1000);
    }
}

// إعادة ضبط المؤقت
function resetTimer() {
    clearInterval(timer);
    timeLeft = workTime * 60; // إعادة تعيين الوقت إلى 25 دقيقة
    isTimerRunning = false;
    isBreakTime = false; // إعادة تعيين الحالة
    updateTimerDisplay();
}

// تحديث إحصائيات الجلسات
function updateStatistics() {
    // زيادة عدد الجلسات المنجزة فقط عند الانتهاء من جلسة العمل
    let sessionCount = parseInt(localStorage.getItem('sessionCount')) || 0;
    let completedTasks = parseInt(localStorage.getItem('completedTasks')) || 0;
    let totalWorkTime = parseInt(localStorage.getItem('totalWorkTime')) || 0;

    // زيادة الإحصائيات فقط إذا كانت الجلسة عمل
    if (!isBreakTime) {
        sessionCount++;
        completedTasks++; // يمكنك تعديل هذا إذا كان لديك نظام مهام محدد
        totalWorkTime += workTime; // إضافة وقت العمل بالدقائق
    }

    localStorage.setItem('sessionCount', sessionCount);
    localStorage.setItem('completedTasks', completedTasks);
    localStorage.setItem('totalWorkTime', totalWorkTime);
}

// بدء المؤقت عند الضغط على زر "ابدأ"
startButton.addEventListener("click", startTimer);

// إعادة ضبط المؤقت عند الضغط على زر "إعادة ضبط"
resetButton.addEventListener("click", resetTimer);

// تحديث العرض عند تحميل الصفحة
updateTimerDisplay();
