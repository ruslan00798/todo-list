
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Загружаем задачи из localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks')
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch {
      return []
    }
  })

  // Текст новой задачи
  const [taskText, setTaskText] = useState('')

  // Выбранный фильтр
  const [filter, setFilter] = useState('all')

  // Сохраняем задачи при каждом изменении
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Добавление задачи
  const handleAddTask = () => {
    const title = taskText.trim()

    if (!title) return

    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    }

    setTasks((prevTasks) => [...prevTasks, newTask])
    setTaskText('')
  }

  // Отметка задачи выполненной
  const handleToggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  // Удаление задачи
  const handleDeleteTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    )
  }

  // Фильтрация задач
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  // Счётчики
  const activeCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <div className="app">
      <header className="header">
        <div className="header-icon">✓</div>
        <h1>My Tasks</h1>
        <p>Organize your day and get things done.</p>
      </header>

      <main className="todo-container">
        <form
          className="todo-form"
          onSubmit={(event) => {
            event.preventDefault()
            handleAddTask()
          }}
        >
          <input
            type="text"
            placeholder="What needs to be done?"
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
          />

          <button type="submit" disabled={!taskText.trim()}>
            + Add task
          </button>
        </form>

        <div className="task-stats">
          <div className="stat">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>

          <div className="stat">
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>

          <div className="stat">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="task-list">
          <div className="task-list-header">
            <h2>My task list</h2>
            <span>{activeCount} left</span>
          </div>

          <div className="filters">
            <button
              type="button"
              className={filter === 'all' ? 'active-filter' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>

            <button
              type="button"
              className={filter === 'active' ? 'active-filter' : ''}
              onClick={() => setFilter('active')}
            >
              Active
            </button>

            <button
              type="button"
              className={filter === 'completed' ? 'active-filter' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>
                {tasks.length === 0
                  ? 'No tasks yet'
                  : 'Nothing here'}
              </h3>
              <p>
                {tasks.length === 0
                  ? 'Add your first task to get started!'
                  : 'Try another filter or add a new task.'}
              </p>
            </div>
          ) : (
            <ul className="tasks">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className={`task-item ${
                    task.completed ? 'completed' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    aria-label={`Mark ${task.title} as ${
                      task.completed ? 'active' : 'completed'
                    }`}
                  />

                  <span className="task-title">{task.title}</span>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="footer">
          <span>My Tasks</span>
          <span>Made with React</span>
        </footer>
      </main>
    </div>
  )
}

export default App

