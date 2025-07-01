import React, { useReducer, useState, useEffect } from "react";

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
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Todo List</h1>
      <form
        onSubmit={handleAddTask}
        className="flex items-center gap-2 mb-6 w-full max-w-md"
      >
        <input
          type="text"
          value={inputValue}
          placeholder="Ajouter une tâche"
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </form>

      <div className="mb-4">
        <button
          onClick={toggleCompletedView}
          className="text-blue-600 hover:underline text-sm"
        >
          {showCompleted ? "Afficher toutes les tâches" : "Afficher les tâches terminées"}
        </button>
      </div>

      <ul className="space-y-3 w-full max-w-md">
        {tasks
          .filter((task) => (showCompleted ? task.isChecked : true))
          .map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-3 bg-white rounded-md shadow ${
                task.isChecked ? "opacity-60 line-through" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.isChecked}
                  onChange={() => toggleChecked(task.id)}
                  className="w-5 h-5 text-blue-500"
                />
                {editId === task.id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-md"
                  />
                ) : (
                  <span>{task.text}</span>
                )}
              </div>
              <div className="flex gap-2">
                {editId === task.id ? (
                  <button
                    onClick={() => handleSaveTask(task.id)}
                    className="text-green-600 hover:text-green-800"
                    title="Enregistrer"
                  >
                    💾
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(task)}
                    className="text-yellow-500 hover:text-yellow-700"
                    title="Modifier"
                  >
                    🖍️
                  </button>
                )}
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
