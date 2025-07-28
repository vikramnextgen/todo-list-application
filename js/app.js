// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const itemsLeftSpan = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const todoItemTemplate = document.getElementById('todo-item-template');

// App State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Initial render
renderTodos();
updateItemsCount();

// Event Listeners
todoForm.addEventListener('submit', addTodo);
todoList.addEventListener('click', handleTodoClick);
clearCompletedBtn.addEventListener('click', clearCompleted);
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// Functions
function addTodo(e) {
    e.preventDefault();
    
    const todoText = todoInput.value.trim();
    if (!todoText) return;
    
    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        createdAt: new Date()
    };
    
    todos.push(newTodo);
    saveTodos();
    renderTodos();
    updateItemsCount();
    
    todoInput.value = '';
    todoInput.focus();
}

function handleTodoClick(e) {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;
    
    const todoId = parseInt(todoItem.dataset.id);
    
    // Handle checkbox click
    if (e.target.classList.contains('todo-checkbox')) {
        toggleTodoComplete(todoId);
    }
    
    // Handle delete button click
    if (e.target.closest('.delete-btn')) {
        deleteTodo(todoId);
    }
}

function toggleTodoComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
    updateItemsCount();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateItemsCount();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateItemsCount();
}

function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    renderTodos();
}

function renderTodos() {
    // Clear current list
    todoList.innerHTML = '';
    
    // Filter todos based on current filter
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true; // 'all' filter
    });
    
    // Render filtered todos
    filteredTodos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });
    
    // Show message if no todos
    if (filteredTodos.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No tasks to show';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        emptyMessage.style.color = 'var(--text-light)';
        todoList.appendChild(emptyMessage);
    }
}

function createTodoElement(todo) {
    // Clone the template
    const todoClone = todoItemTemplate.content.cloneNode(true);
    const todoElement = todoClone.querySelector('.todo-item');
    
    // Set todo data
    todoElement.dataset.id = todo.id;
    if (todo.completed) {
        todoElement.classList.add('completed');
    }
    
    // Set checkbox state
    const checkbox = todoElement.querySelector('.todo-checkbox');
    checkbox.checked = todo.completed;
    
    // Set todo text
    const todoText = todoElement.querySelector('.todo-text');
    todoText.textContent = todo.text;
    
    return todoElement;
}

function updateItemsCount() {
    const activeTodos = todos.filter(todo => !todo.completed);
    const itemText = activeTodos.length === 1 ? 'item' : 'items';
    itemsLeftSpan.textContent = `${activeTodos.length} ${itemText} left`;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}