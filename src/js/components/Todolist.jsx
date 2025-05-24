import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const API_URL = "https://playground.4geeks.com/todo";
const USERNAME = "delicado";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/users/${USERNAME}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([])
    })
    .then(response => {
      if (!response.ok && response.status !== 400) {
        throw new Error("Error al crear usuario");
      }
      return loadTasks();
    })
    .catch(error => {
      console.error("Error al crear usuario:", error);
      return loadTasks();
    })
    .finally(() => setIsLoading(false));
  }, []);

  const loadTasks = () => {
    return fetch(`${API_URL}/users/${USERNAME}`)
      .then(response => {
        if (!response.ok) throw new Error("Error al obtener tareas");
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.todos)) {
          setTasks(data.todos);
        }
      })
      .catch(error => console.error("Error al obtener tareas:", error));
  };

  const addTask = () => {
    if (inputValue.trim() === "") return;

    fetch(`${API_URL}/todos/${USERNAME}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: inputValue,
        is_done: false
      })
    })
    .then(response => {
      if (!response.ok) throw new Error("Error al agregar tarea");
      return loadTasks();
    })
    .then(() => {
      setInputValue("");
    })
    .catch(error => console.error("Error al agregar tarea:", error));
  };

  const toggleTask = (todoId, isTaskDone) => {
    const taskToUpdate = tasks.find(task => task.id === todoId);
    if (!taskToUpdate) return;

    fetch(`${API_URL}/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...taskToUpdate,
        is_done: isTaskDone
      })
    })
    .then(response => {
      if (!response.ok) throw new Error("Error al actualizar tarea");
      return loadTasks();
    })
    .catch(error => console.error("Error al actualizar tarea:", error));
  };

  const removeTask = (todoId) => {
    fetch(`${API_URL}/todos/${todoId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
    .then(response => {
      if (!response.ok) throw new Error("Error al eliminar tarea");
      return loadTasks();
    })
    .catch(error => console.error("Error al eliminar tarea:", error));
  };

  const clearAllTasks = () => {
    fetch(`${API_URL}/users/${USERNAME}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
    .then(response => {
      if (!response.ok) throw new Error("Error al eliminar usuario");
      return fetch(`${API_URL}/users/${USERNAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([])
      });
    })
    .then(response => {
      if (!response.ok) throw new Error("Error al recrear usuario");
      return loadTasks();
    })
    .catch(error => console.error("Error al limpiar tareas:", error));
  };

  if (isLoading) {
    return <div className="todo-container">Cargando...</div>;
  }

  return (
    <div className="todo-container">
      <div className="todo-box">
        <h2>To-Do List</h2>
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Nueva tarea..."
          />
        </div>
        <ul>
          {tasks.length === 0 ? (
            <li className="no-tasks">¡No hay tareas pendientes!</li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className={task.is_done ? "task-done" : ""}>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.is_done}
                    onChange={(e) => toggleTask(task.id, e.target.checked)}
                    className="task-checkbox"
                  />
                  <span className="task-label">{task.label}</span>
                </div>
                <button className="removeButton" onClick={() => removeTask(task.id)}>❌</button>
              </li>
            ))
          )}
        </ul>
        <footer>
          <div className="task-count">
            {tasks.filter(task => !task.is_done).length} items left
          </div>
          {tasks.length > 0 && (
            <button className="clear-all-button" onClick={clearAllTasks}>
              Limpiar todas
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default TodoList;
