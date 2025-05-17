import React, { useReducer, useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  const initialState = [
    { id: 0, text: "Task one", isChecked: false },
    { id: 1, text: "Task two", isChecked: false },
  ];

  const reducer = (state, action) => {
    switch (action.type) {
      case "addTask":
        return [
          ...state,
          {
            id: Date.now(),
            text: action.payload,
            isChecked: false,
          },
        ];
      case "taskDelete":
        return state.filter((task) => task.id !== action.payload);
      case "toggleChecked":
        return state.map((task) =>
          task.id === action.payload
            ? { ...task, isChecked: !task.isChecked }
            : task
        );
      case "saveTask":
        return state.map((task) =>
          task.id === action.payload ? { ...task, text: action.text } : task
        );
      default:
        return state;
    }
  };

  const tasksFromStorage = JSON.parse(localStorage.getItem("tasks")) || initialState;
  const [tasks, dispatch] = useReducer(reducer, tasksFromStorage);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(e) {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      dispatch({ type: "addTask", payload: inputValue });
      setInputValue("");
    }
  }

  function handleDelete(id) {
    dispatch({ type: "taskDelete", payload: id });
  }

  function toggleChecked(id) {
    dispatch({ type: "toggleChecked", payload: id });
  }

  function startEdit(task) {
    setEditId(task.id);
    setEditText(task.text);
  }

  function handleSaveTask(id) {
    if (editText.trim() !== "") {
      dispatch({ type: "saveTask", payload: id, text: editText });
      setEditId(null);
      setEditText("");
    }
  }

  function toggleCompletedView() {
    setShowCompleted((prev) => !prev);
  }

  return (
    <>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={inputValue}
          placeholder="Ajouter une tâche"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div>
        <button onClick={toggleCompletedView}>
          {showCompleted ? "Afficher toutes les tâches" : "Afficher les tâches terminées"}
        </button>
      </div>

      <ul>
        {tasks
          .filter((task) => (showCompleted ? task.isChecked : true))
          .map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.isChecked}
                onChange={() => toggleChecked(task.id)}
              />
              {editId === task.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleSaveTask(task.id)}>💾</button>
                </>
              ) : (
                <>
                  {task.text}
                  <button onClick={() => startEdit(task)}>🖍️</button>
                </>
              )}
              <button onClick={() => handleDelete(task.id)}>🗑️</button>
            </li>
          ))}
      </ul>
    </>
  );
}
