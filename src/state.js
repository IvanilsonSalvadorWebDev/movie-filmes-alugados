// src/state.js

let state = {
    tasks: JSON.parse(localStorage.getItem('my-todo-tasks')) || [],
    users: JSON.parse(localStorage.getItem('my-todo-users')) || [],
    currentUser: JSON.parse(localStorage.getItem('my-todo-current-user')) || null
};

const saveAll = () => {
    localStorage.setItem('my-todo-tasks', JSON.stringify(state.tasks));
    localStorage.setItem('my-todo-users', JSON.stringify(state.users));
    localStorage.setItem('my-todo-current-user', JSON.stringify(state.currentUser));
};

// --- AUTH ---
export const registerUser = (name, email, password) => {
    const userExists = state.users.find(u => u.email === email);
    if (userExists) return { success: false };
    const newUser = { id: crypto.randomUUID(), name, email, password };
    state.users.push(newUser);
    saveAll();
    return { success: true };
};

export const login = (email, password) => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
        state.currentUser = user;
        saveAll();
        return true;
    }
    return false;
};

export const logout = () => {
    state.currentUser = null;
    saveAll();
};

export const getCurrentUser = () => state.currentUser;

// --- TASKS ---
export const addTask = (text, priority = 'media') => {
    const newTask = {
        id: crypto.randomUUID(),
        userId: state.currentUser?.id,
        text,
        priority,
        completed: false,
        timeSpent: 0,
        createdAt: new Date().toISOString()
    };
    state.tasks.push(newTask);
    saveAll();
    return state.tasks;
};

export const toggleTask = (id) => {
    state.tasks = state.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAll();
};

export const deleteTask = (id) => {
    state.tasks = state.tasks.filter(task => task.id !== id);
    saveAll();
};

export const getTasks = () => {
    const userTasks = state.tasks.filter(t => t.userId === state.currentUser?.id);
    const weights = { alta: 3, media: 2, baixa: 1 };
    return [...userTasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return weights[b.priority] - weights[a.priority];
    });
};

// --- TIMER & STATS ---
export const updateTaskTime = (id, secondsToAdd) => {
    state.tasks = state.tasks.map(task => 
        task.id === id ? { ...task, timeSpent: (task.timeSpent || 0) + secondsToAdd } : task
    );
    saveAll();
};

// ESTA É A FUNÇÃO QUE ESTAVA A FALTAR O EXPORT
export const getUserStats = () => {
    const userTasks = getTasks();
    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter(t => t.completed).length;
    const totalTimeSeconds = userTasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);

    return { totalTasks, completedTasks, totalTimeSeconds };
};