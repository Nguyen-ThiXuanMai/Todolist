import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "../App.css";

function AddToDo(props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [createTodo, setCreateTodo] = useState(false);

  function handleValueChange(e) {
    setValue(e.target.value);
  }

  //Create item
  function onCreateItem(e) {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: value,
      }),
    };
    fetch("https://60d02d3b7de0b20017107d55.mockapi.io/todo", requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          setCreateTodo(true);
        },
        (error) => {
          setError(error);
        }
      );
  }

  return (
    <form className="add-task" onSubmit={onCreateItem}>
      <input
        className="task-input"
        value={value}
        onChange={handleValueChange}
      />
      <button className="btn-icon">
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </form>
  );
}

export default AddToDo;
