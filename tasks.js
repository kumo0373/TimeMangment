// الحصول على العناصر من DOM
const addTaskButton = document.getElementById("addTaskButton");
const newTaskInput = document.getElementById("newTaskInput");
const taskStartTimeInput = document.getElementById("taskStartTimeInput");
const taskEndTimeInput = document.getElementById("taskEndTimeInput");
const taskList = document.getElementById("taskList");

// تحميل المهام المحفوظة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', loadTasks);

// إضافة حدث الضغط على زر إضافة المهمة
addTaskButton.addEventListener("click", addTask);

// دالة لإضافة مهمة جديدة إلى القائمة
function addTask() {
    const taskText = newTaskInput.value.trim();
    const taskStartTime = taskStartTimeInput.value;
    const taskEndTime = taskEndTimeInput.value;

    if (taskText !== "" && taskStartTime !== "" && taskEndTime !== "") {
        const taskItem = document.createElement("li");

        // نص المهمة مع وقت البداية والنهاية
        const taskContent = document.createElement("span");
        taskContent.textContent = `${taskText} (من: ${taskStartTime} إلى: ${taskEndTime})`;

        // إنشاء عناصر التحكم (إكمال / حذف)
        const taskActions = document.createElement("div");
        taskActions.classList.add("task-actions");

        const completeButton = document.createElement("button");
        completeButton.textContent = "إكمال";
        completeButton.addEventListener("click", () => {
            taskItem.classList.toggle("completed");
            saveTasks(); // حفظ المهام بعد التعديل
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "حذف";
        deleteButton.addEventListener("click", () => {
            taskItem.remove();
            saveTasks(); // حفظ المهام بعد الحذف
        });

        taskActions.appendChild(completeButton);
        taskActions.appendChild(deleteButton);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskActions);

        // إضافة المهمة إلى القائمة
        taskList.appendChild(taskItem);

        // مسح الحقول
        newTaskInput.value = "";
        taskStartTimeInput.value = "";
        taskEndTimeInput.value = "";

        // حفظ المهام في Local Storage
        saveTasks();
    }
}

// دالة لحفظ المهام في Local Storage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(taskItem => {
        const taskText = taskItem.querySelector("span").textContent;
        const isCompleted = taskItem.classList.contains("completed");
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// دالة لتحميل المهام من Local Storage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        const taskItem = document.createElement("li");
        const taskContent = document.createElement("span");
        taskContent.textContent = task.text;

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        const taskActions = document.createElement("div");
        taskActions.classList.add("task-actions");

        const completeButton = document.createElement("button");
        completeButton.textContent = "إكمال";
        completeButton.addEventListener("click", () => {
            taskItem.classList.toggle("completed");
            saveTasks(); // حفظ المهام بعد التعديل
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "حذف";
        deleteButton.addEventListener("click", () => {
            taskItem.remove();
            saveTasks(); // حفظ المهام بعد الحذف
        });

        taskActions.appendChild(completeButton);
        taskActions.appendChild(deleteButton);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskActions);

        taskList.appendChild(taskItem);
    });
}
