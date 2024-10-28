const scheduleBody = document.getElementById("schedule-body");

// استرجاع البيانات المحفوظة من localStorage
function loadSchedule() {
    const scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || [];
    for (let hour = 5; hour <= 24; hour++) {
        const row = document.createElement("tr");

        const timeCell = document.createElement("td");
        timeCell.textContent = formatTime(hour);
        row.appendChild(timeCell);

        for (let day = 0; day < 7; day++) {
            const cell = document.createElement("td");

            // استرجاع المهمة الحالية إذا كانت موجودة
            if (scheduleData[hour - 5] && scheduleData[hour - 5][day]) {
                const { taskName, taskType } = scheduleData[hour - 5][day];
                cell.textContent = taskName;

                const taskClass = `task-${taskType}`;
                cell.classList.add('task-cell', taskClass);
            }

            // إضافة حقول الإدخال كما كان
            const taskInput = document.createElement("input");
            taskInput.type = "text";
            taskInput.placeholder = "اسم المهمة";
            const taskTypeSelect = createTaskTypeSelect();

            // إخفاء حقول الإدخال والقائمة المنسدلة في البداية
            taskInput.style.display = "none";
            taskTypeSelect.style.display = "none";

            let isTaskTypeOpen = false;

            cell.addEventListener("click", function() {
                if (!isTaskTypeOpen) {
                    taskInput.style.display = "inline-block";
                    taskTypeSelect.style.display = "inline-block";
                    taskInput.focus();
                }
            });

            taskTypeSelect.addEventListener("focus", function() {
                isTaskTypeOpen = true;
            });

            taskTypeSelect.addEventListener("blur", function() {
                isTaskTypeOpen = false;
            });

            taskInput.addEventListener("blur", () => saveTask(cell, taskInput, taskTypeSelect, hour, day));
            taskInput.addEventListener("keypress", (e) => {
                if (e.key === 'Enter') {
                    saveTask(cell, taskInput, taskTypeSelect, hour, day);
                }
            });

            taskTypeSelect.addEventListener("change", () => saveTask(cell, taskInput, taskTypeSelect, hour, day));

            cell.appendChild(taskInput);
            cell.appendChild(taskTypeSelect);
            row.appendChild(cell);
        }

        scheduleBody.appendChild(row);
    }
}

// إنشاء قائمة منسدلة لاختيار نوع المهمة
function createTaskTypeSelect() {
    const taskType = document.createElement("select");
    const options = ["اختر نوع المهمة", "study", "work", "exercise", "other"];
    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option === "اختر نوع المهمة" ? "" : option;
        opt.textContent = option === "اختر نوع المهمة" ? option : option.charAt(0).toUpperCase() + option.slice(1);
        taskType.appendChild(opt);
    });
    return taskType;
}

// حفظ المهمة في الخلية وlocalStorage
function saveTask(cell, taskInput, taskTypeSelect, hour, day) {
    if (taskInput.value !== "" && taskTypeSelect.value !== "") {
        cell.textContent = taskInput.value;

        const taskClass = `task-${taskTypeSelect.value}`;
        cell.classList.add('task-cell', taskClass);

        // حفظ البيانات في localStorage
        const scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || [];
        if (!scheduleData[hour - 5]) {
            scheduleData[hour - 5] = [];
        }
        scheduleData[hour - 5][day] = {
            taskName: taskInput.value,
            taskType: taskTypeSelect.value
        };
        localStorage.setItem('scheduleData', JSON.stringify(scheduleData));

        taskInput.style.display = "none";
        taskTypeSelect.style.display = "none";
    }
}

// تحميل الجدول عند تحميل الصفحة
loadSchedule();

// زر حفظ الجدول
document.getElementById("save-btn").addEventListener("click", () => {
    // لا حاجة لإعادة تحميل الجدول بالكامل، 
    // البيانات سيتم تحديثها مباشرة عند إدخال المهام.
});

// زر مسح الجدول
document.getElementById("clear-btn").addEventListener("click", () => {
    // مسح البيانات من localStorage
    localStorage.removeItem('scheduleData');
    
    // إعادة تحميل الصفحة لإزالة المهام من الجدول
    location.reload();
});

// تنسيق الساعة بصيغة AM/PM
function formatTime(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
}
