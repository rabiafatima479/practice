// LocalStorage se tasks load karein (Twist #1)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Event Listeners setup
document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);
document.getElementById('searchInput').addEventListener('input', renderTasks);
document.getElementById('statusFilter').addEventListener('change', renderTasks);
document.getElementById('priorityFilter').addEventListener('change', renderTasks);
document.getElementById('sortSelect').addEventListener('change', renderTasks);

// Initial Load par render karein
renderTasks();

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function handleFormSubmit(e) {
    e.preventDefault();

    const editTaskId = document.getElementById('editTaskId').value;
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const priorityInput = document.getElementById('priority');
    const dueDateInput = document.getElementById('dueDate');

    const titleError = document.getElementById('titleError');
    const priorityError = document.getElementById('priorityError');
    const dateError = document.getElementById('dateError');

    titleError.textContent = '';
    priorityError.textContent = '';
    dateError.textContent = '';

    let isValid = true;

    // Test 1: Title Validation (Spaces only ya empty check)
    const title = titleInput.value.trim();
    if (title === '') {
        titleError.textContent = 'Title is required (cannot be empty or spaces) ❌';
        isValid = false;
    }

    const priority = priorityInput.value;
    if (priority === '') {
        priorityError.textContent = 'Please select a priority ❌';
        isValid = false;
    }

    const dueDate = dueDateInput.value;
    const today = new Date().toISOString().split('T')[0];
    
    if (dueDate === '') {
        dateError.textContent = 'Due date is required ❌';
        isValid = false;
    } else if (dueDate < today && !editTaskId) {
        dateError.textContent = 'Due date cannot be in the past ❌';
        isValid = false;
    }

    if (isValid) {
        const description = descInput.value.trim();

        // Twist #4: Edit without duplicate creation
        if (editTaskId) {
            tasks = tasks.map(task => {
                if (task.id == editTaskId) {
                    return { ...task, title, description, priority, dueDate };
                }
                return task;
            });
            resetForm();
        } else {
            const newTask = {
                id: Date.now(),
                title,
                description,
                priority,
                dueDate,
                status: 'Pending'
            };
            tasks.push(newTask);
            this.reset();
        }

        saveToLocalStorage(); // Twist #1
        renderTasks();        // Twist #2 & #3 handle honge
    }
}

function updateStatistics() {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const highPriority = tasks.filter(t => t.priority === 'High').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statCompleted').textContent = completed;
    document.getElementById('statHigh').textContent = highPriority;
}

function renderTasks() {
    updateStatistics(); // Twist #2: Statistics update on every change

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const sortBy = document.getElementById('sortSelect').value;

    // Filtering logic (Search + Status + Priority)
    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery);
        const matchesStatus = (statusFilter === 'All') || (task.status === statusFilter);
        const matchesPriority = (priorityFilter === 'All') || (task.priority === priorityFilter);

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sorting logic
    filteredTasks.sort((a, b) => {
        if (sortBy === 'newest') {
            return b.id - a.id;
        } else if (sortBy === 'oldest') {
            return a.id - b.id;
        } else if (sortBy === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === 'priority') {
            const priorityWeight = { High: 1, Medium: 2, Low: 3 };
            return priorityWeight[a.priority] - priorityWeight[b.priority];
        }
    });

    // Twist #3: Dynamic Empty States
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>Add a new task to get started.</p>
            </div>`;
        return;
    }

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No matching tasks found</h3>
                <p>Try changing your search or filter.</p>
            </div>`;
        return;
    }

    filteredTasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${task.priority} ${task.status === 'Completed' ? 'completed' : ''}`;
        taskCard.setAttribute('data-id', task.id);

        taskCard.innerHTML = `
            <div class="task-info">
                <h3>${escapeHTML(task.title)}</h3>
                <p>${escapeHTML(task.description || 'No description provided.')}</p>
                <div class="task-meta">
                    <span>📅 Due: ${task.dueDate}</span>
                    <span class="badge ${task.priority}">${task.priority}</span>
                    <span class="status-badge ${task.status.toLowerCase()}">${task.status}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-action btn-complete" onclick="toggleComplete(${task.id})">
                    ${task.status === 'Pending' ? 'Complete' : 'Undo'}
                </button>
                <button class="btn-action btn-edit" onclick="editTask(${task.id})">Edit</button>
                <button class="btn-action btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(taskCard);
    });
}

function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' };
        }
        return task;
    });
    saveToLocalStorage();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('editTaskId').value = task.id;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('priority').value = task.priority;
    document.getElementById('dueDate').value = task.dueDate;

    document.getElementById('formHeading').textContent = 'Edit Task';
    document.getElementById('submitBtn').textContent = 'Update Task';
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
    
    const editTaskId = document.getElementById('editTaskId').value;
    if (editTaskId == id) {
        resetForm();
    }
}

function resetForm() {
    document.getElementById('taskForm').reset();
    document.getElementById('editTaskId').value = '';
    document.getElementById('formHeading').textContent = 'Add New Task';
    document.getElementById('submitBtn').textContent = 'Add Task';
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}