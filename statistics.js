// قراءة الإحصائيات من التخزين المحلي
function loadStats() {
    const sessionCount = localStorage.getItem('sessionCount') || 0;
    const completedTasks = localStorage.getItem('completedTasks') || 0;
    const totalWorkTime = localStorage.getItem('totalWorkTime') || 0;

    document.getElementById('sessionCount').textContent = `عدد الجلسات المنجزة: ${sessionCount}`;
    document.getElementById('completedTasks').textContent = `عدد المهام المكتملة: ${completedTasks}`;
    document.getElementById('totalWorkTime').textContent = `وقت العمل الإجمالي: ${totalWorkTime} دقيقة`;
}

// إعادة تعيين الإحصائيات
function resetStats() {
    localStorage.setItem('sessionCount', 0);
    localStorage.setItem('completedTasks', 0);
    localStorage.setItem('totalWorkTime', 0);
    loadStats();
}

// تحميل الإحصائيات عند فتح الصفحة
loadStats();
