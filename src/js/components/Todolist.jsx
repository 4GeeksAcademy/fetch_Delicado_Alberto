import React, { useState } from "react";
import "../../styles/index.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTask = () => {
      setTasks([...tasks, {text: inputValue}]);
      setInputValue("");
    };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
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
          {tasks.map((task, index) => (
            <li key={index}>
              {task.text}
              <button className="removeButton" onClick={() => removeTask(index)}>❌</button>
            </li>
          ))}
        </ul>
        <footer style={{ marginTop: "20px", fontWeight: "bold" }}>
          {tasks.length} items left
        </footer>
      </div>
    </div>
  );
};

export default TodoList;
