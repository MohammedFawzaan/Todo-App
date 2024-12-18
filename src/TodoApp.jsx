import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import logoImage from "./assets/todo-logo.png";

const TodoApp = () => {
    // State for tasks
    const [arr, setArr] = useState(() => {
        // Retrieve tasks from localStorage or set default task
        const storedTasks = localStorage.getItem("tasks");
        return storedTasks ? JSON.parse(storedTasks) : [{}];
    });

    const [task, setTask] = useState(""); // Input for new task
    const [editingId, setEditingId] = useState(null); // ID of task being edited
    const [editedTask, setEditedTask] = useState(""); // Edited task text

    // Save tasks to localStorage whenever `arr` changes
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(arr));
    }, [arr]);

    function addTask() {
        if (task.trim() === "") return;
        setArr((prevState) => [...prevState, { task: task.trim(), id: uuidv4(), isDone: false }]);
        setTask("");
    }

    function updateTodo(event) {
        setTask(event.target.value);
    }

    function deleteTask(id) {
        setArr((prevState) => prevState.filter((element) => element.id !== id));
    }

    function editTask(id, task) {
        setEditingId(id);
        setEditedTask(task);
    }

    function updateTodoAfterEdit(event) {
        setEditedTask(event.target.value);
    }

    function markAsDone(id) {
        setArr((prevState) =>
            prevState.map((element) =>
                element.id === id ? { ...element, isDone: !element.isDone } : element
            )
        );
    }

    function saveTask() {
        setArr((prevState) =>
            prevState.map((element) =>
                element.id === editingId ? { ...element, task: editedTask } : element
            )
        );
        setEditingId(null);
        setEditedTask("");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-black flex items-center justify-center">
            <div className="rounded-lg p-12 w-full max-w-2xl">
                {/* Logo and Title */}
                <div className="flex items-center justify-center mb-10">
                    <img src={logoImage} alt="Todo App Logo" className="h-16 mr-4" />
                    <h1 className="font-bold text-6xl text-white">Todo App</h1>
                </div>

                {/* Input Field */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Enter your Task here"
                        onChange={updateTodo}
                        value={task}
                        className="text-2xl font-black flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                        onClick={addTask}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                        Add Task
                    </button>
                </div>

                {/* List of Tasks */}
                <ul className="space-y-4">
                    {arr.map((element) => (
                        <div
                            key={element.id}
                            className={`flex items-center p-4 rounded-lg transition-all ${editingId === element.id ? "bg-gray-700" : "bg-white"}`}>
                            <button
                                onClick={() => markAsDone(element.id)}
                                className="text-3xl mr-4 focus:outline-none hover:text-green-600 transition">
                                {element.isDone ? (
                                    <i className="fa-solid fa-square-check text-green-600"></i>
                                ) : (
                                    <i className="fa-regular fa-square-check"></i>
                                )}
                            </button>

                            {editingId === element.id ? (
                                <input
                                    type="text"
                                    value={editedTask}
                                    onChange={updateTodoAfterEdit}
                                    className="border-gray-300 font-bold text-2xl p-2 rounded w-full"
                                />
                            ) : (
                                <li
                                    className={`font-bold text-2xl flex-grow transition-all ${element.isDone ? "line-through text-gray-500" : ""}`}>
                                    {element.task}
                                </li>
                            )}

                            {editingId === element.id ? (
                                <button
                                    onClick={saveTask}
                                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg shadow hover:bg-blue-600 transition">
                                    Save
                                </button>
                            ) : (
                                <>
                                    {!element.isDone && (
                                        <button
                                            onClick={() => editTask(element.id, element.task)}
                                            className="bg-yellow-500 text-white px-4 py-2 ml-2 rounded-lg shadow hover:bg-yellow-600 transition">
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteTask(element.id)}
                                        className="bg-red-500 text-white px-4 py-2 ml-2 rounded-lg shadow hover:bg-red-600 transition">
                                        &times;
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TodoApp;