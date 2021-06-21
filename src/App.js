import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import AddToDo from "./components/addtodo";
import Todolist from "./components/todolist";

function App(props) {
  return (
    <div className="todolist">
      <label className="title-text">To Do List</label> <br />
      <Todolist />
    </div>
  );
}

export default App;
