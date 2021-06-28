import React from "react";
import { TodoList } from "./components/todolist";

function App(props) {
  return (
    <div className="todo-app-container">
      <TodoList />
    </div>
  );
}

export default App;
