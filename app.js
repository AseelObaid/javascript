const readline = require('readline');
const fs = require('fs');

// إعداد واجهة قراءة البيانات من سطر الأوامر
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks(); // تحميل المهام عند بدء التشغيل
    }

    // إضافة مهمة جديدة
    addTask(description) {
        const newTask = {
            id: this.tasks.length + 1,
            description: description,
            completed: false,
        };
        this.tasks.push(newTask);
        this.saveTasks();
        console.log('Task added successfully!');
    }

    // عرض جميع المهام
    displayTasks() {
        if (this.tasks.length === 0) {
            console.log("No tasks available.");
        } else {
            this.tasks.forEach(task => {
                console.log(`${task.id}. ${task.description} [${task.completed ? 'Completed' : 'Pending'}]`);
            });
        }
    }

    // تحديث حالة إكمال المهمة
    toggleTaskCompletion(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            console.log(`Task ${id} status updated to: ${task.completed ? 'Completed' : 'Pending'}`);
        } else {
            console.log(`Task with ID ${id} not found.`);
        }
    }

    // حذف المهمة
    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.reorderTaskIds();
        this.saveTasks();
        console.log(`Task ${id} removed.`);
    }

    // تحديث وصف المهمة
    updateTask(id, newDescription) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.description = newDescription;
            this.saveTasks();
            console.log(`Task ${id} description updated.`);
        } else {
            console.log(`Task with ID ${id} not found.`);
        }
    }

    // البحث عن المهام
    searchTask(keyword) {
        const filteredTasks = this.tasks.filter(task =>
            task.description.toLowerCase().includes(keyword.toLowerCase())
        );
        if (filteredTasks.length > 0) {
            filteredTasks.forEach(task => {
                console.log(`${task.id}. ${task.description} [${task.completed ? 'Completed' : 'Pending'}]`);
            });
        } else {
            console.log(`No tasks found with keyword: ${keyword}`);
        }
    }

    // حفظ المهام في ملف
    saveTasks() {
        fs.writeFileSync('tasks.json', JSON.stringify(this.tasks, null, 2));
    }

    // تحميل المهام من ملف
    loadTasks() {
        if (fs.existsSync('tasks.json')) {
            const data = fs.readFileSync('tasks.json');
            return JSON.parse(data);
        }
        return [];
    }

    // إعادة ترتيب IDs بعد حذف المهام
    reorderTaskIds() {
        this.tasks.forEach((task, index) => {
            task.id = index + 1;
        });
    }
}

// إنشاء مدير المهام
const taskManager = new TaskManager();

// الوظيفة الرئيسية للتفاعل مع المستخدم
function mainMenu() {
    console.log("\nTask Manager - Command-line Based\n");
    console.log("1. Add a task");
    console.log("2. View all tasks");
    console.log("3. Toggle task completion");
    console.log("4. Remove a task");
    console.log("5. Update a task");
    console.log("6. Search tasks");
    console.log("7. Exit\n");

    rl.question("Choose an option: ", (input) => {
        switch (input) {
            case "1":
                rl.question("Enter task description: ", (description) => {
                    taskManager.addTask(description);
                    mainMenu();
                });
                break;
            case "2":
                taskManager.displayTasks();
                mainMenu();
                break;
            case "3":
                rl.question("Enter task ID to toggle completion: ", (id) => {
                    taskManager.toggleTaskCompletion(parseInt(id));
                    mainMenu();
                });
                break;
            case "4":
                rl.question("Enter task ID to remove: ", (id) => {
                    taskManager.removeTask(parseInt(id));
                    mainMenu();
                });
                break;
            case "5":
                rl.question("Enter task ID to update: ", (id) => {
                    rl.question("Enter new task description: ", (newDescription) => {
                        taskManager.updateTask(parseInt(id), newDescription);
                        mainMenu();
                    });
                });
                break;
            case "6":
                rl.question("Enter search keyword: ", (keyword) => {
                    taskManager.searchTask(keyword);
                    mainMenu();
                });
                break;
            case "7":
                console.log("Exiting...");
                rl.close();
                break;
            default:
                console.log("Invalid option, please try again.");
                mainMenu();
        }
    });
}

mainMenu(); // بدء القائمة الرئيسية
