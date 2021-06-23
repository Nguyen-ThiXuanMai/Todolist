import React from "react";
import { Example } from "./components/example";
import Todolist from "./components/todolist";

function App(props) {
  return (
    <div className="todolist">
      <Todolist />
      {/* <Example /> */}
    </div>
  );
}

export default App;
