import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      await addDoc(collection(db, "todos"), { text: newTodo, completed: false });
      setNewTodo("");
    }
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const toggleComplete = async (id, completed) => {
    await updateDoc(doc(db, "todos", id), { completed: !completed });
  };

  const startEditing = (id, currentText) => {
    setEditingTodoId(id);
    setEditingText(currentText);
  };

  const updateTodo = async (e) => {
    e.preventDefault();
    if (editingText.trim()) {
      await updateDoc(doc(db, "todos", editingTodoId), { text: editingText });
      setEditingTodoId(null);
      setEditingText("");
    }
  };

  return (
    <div className="App" style={styles.container}>
      <h1>Todo List</h1>
      <form onSubmit={addTodo} style={styles.form}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Todo</button>
      </form>
      <ul style={styles.list}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              ...styles.todoItem,
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {editingTodoId === todo.id ? (
              <form onSubmit={updateTodo} style={styles.editForm}>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.button}>Update</button>
                <button onClick={() => setEditingTodoId(null)} style={styles.cancelButton}>Cancel</button>
              </form>
            ) : (
              <>
                <span onClick={() => toggleComplete(todo.id, todo.completed)} style={styles.todoText}>
                  {todo.text}
                </span>
                <button onClick={() => startEditing(todo.id, todo.text)} style={styles.editButton}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)} style={styles.deleteButton}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", maxWidth: 400, margin: "0 auto" },
  form: { display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 },
  input: { padding: 8, width: "70%" },
  button: { padding: 8 },
  list: { listStyle: "none", padding: 0 },
  todoItem: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0" },
  todoText: { cursor: "pointer" },
  editButton: { padding: 8, backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" },
  deleteButton: { padding: 8, backgroundColor: "red", color: "white", border: "none", cursor: "pointer" },
  cancelButton: { padding: 8, backgroundColor: "grey", color: "white", border: "none", cursor: "pointer" },
  editForm: { display: "flex", gap: 8 },
};

export default App;
