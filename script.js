// Get elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const filterBtns = document.querySelectorAll('.filter-btn');
const affirmationText = document.getElementById('affirmationText');
const affirmationBtn = document.getElementById('affirmationBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Affirmations array
const affirmations = [
    "You are doing amazing!",
    "Your vibe is immaculate ✨",
    "You're crushing it today!",
    "Believe in yourself, babe!",
    "You're unstoppable!",
    "Keep shining bright! 💜",
    "You've got this!",
    "Your energy is magical!",
    "You're making it happen!",
    "Stay focused, stay cute!",
    "You're doing better than you think!",
    "Small steps still count!",
    "You deserve good things!",
    "Your efforts matter!",
    "Keep going, superstar! ⭐",
    "You're worthy of success!",
    "Progress over perfection!",
    "You're absolutely capable!",
    "Your potential is limitless!",
    "You're creating your reality!"
];

// Initialize
renderTasks();

// Affirmation button click
affirmationBtn.addEventListener('click', () => {
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    affirmationText.textContent = randomAffirmation;
    affirmationText.style.animation = 'none';
    setTimeout(() => {
        affirmationText.style.animation = 'fadeIn 0.5s ease';
    }, 10);
});

// Add task
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        taskInput.focus();
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Toggle task completion
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Filter tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Render tasks
function renderTasks() {
    let filteredTasks = tasks;

    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>${currentFilter === 'completed' ? 'No completed tasks yet' : 'No tasks yet. Add one to get started!'}</p>
            </div>
        `;
    } else {
        taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <div class="checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
                <span class="task-text">${escapeHtml(task.text)}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </li>
        `).join('');
    }

    updateCounter();
}

// Update counter
function updateCounter() {
    const activeCount = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} remaining`;
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}