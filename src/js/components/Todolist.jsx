import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const API_URL = "https://playground.4geeks.com/todo";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch(API_URL+"/users/alberto")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.todos)) {
          setTasks(data.todos);
        }
      })
      .catch((error) => console.error("Error al obtener tareas:", error));
  }, []);

  const updateTasksOnServer = () => {
    fetch(`${API_URL}/todos/alberto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: inputValue, is_done: false }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error en el POST");
        return response.json();
      })
      .then((data) => {
        // En vez de añadir directamente, volvemos a obtener la lista actualizada
        return fetch(`${API_URL}/users/alberto`);
      })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.todos)) {
          setTasks(data.todos);
        }
      })
      .catch((error) => console.error("Error al actualizar tareas:", error));
  };

  const addTask = () => {
    if (inputValue.trim() === "") return;
    updateTasksOnServer();
    setInputValue("");
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    updateTasksOnServer(newTasks);
  };

  const removeTasksOnServer = (id) => {
    fetch(API_URL+"/todos/"+id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(() => setTasks(tasks.filter(task => task.id != id)))
      .catch((error) => console.error("Error al actualizar tareas:", error));
  };

  return (
    <div className="todo-container">
      <div className="todo-box">
        <h2>To-Do List</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Nueva tarea..."
        />
  <ul>
    {tasks.length === 0 ? (
      <li className="no-tasks">¡No hay tareas pendientes!</li>
    ) : (
      tasks.map((task, index) => (
        <li key={task.id || index}>
          {task.label}
          <button className="removeButton" onClick={() => removeTasksOnServer(task.id)}>❌</button>
        </li>
      ))
    )}
  </ul>

        <footer style={{ marginTop: "20px", fontWeight: "bold" }}>
          {tasks.length} items left
        </footer>
      </div>
    </div>
  );
};

export default TodoList;
