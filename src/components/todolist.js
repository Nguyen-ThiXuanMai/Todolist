import React, { useEffect, useState } from "react";
import { faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../App.css";

function Todolist() {
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(false);
  const [todoList, settodoList] = useState([]);
  const [value, setValue] = useState("");
  const [createTodo, setCreateTodo] = useState(false);
  const [updateTodo, setUpdateTodo] = useState(false);
  const [deleteTodo, setDeleteTodo] = useState(false);

  //Get Todolist
  useEffect(() => {
    fetch("https://60d02d3b7de0b20017107d55.mockapi.io/todo", {
      method: "GET",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoading(true);
          settodoList(result);
          setCreateTodo(false);
          setDeleteTodo(false);
          setUpdateTodo(false);
        },
        (error) => {
          setIsLoading(true);
          setError(error);
        }
      );
  }, [updateTodo, createTodo, deleteTodo]);

  function handleValueChange(e) {
    setValue(e.target.value);
  }

  //Create item
  function handleCreate(e) {
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
          setValue("");
        },
        (error) => {
          setError(error);
        }
      );
  }

  //Update item
  function handleUpdate(idUpdate) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    };
    fetch(
      "https://60d02d3b7de0b20017107d55.mockapi.io/todo/" + idUpdate,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setUpdateTodo(true);
        },
        (error) => {
          setIsLoading(true);
          setError(error);
        }
      );
  }

  //Delete
  function handleDelete(idDelete) {
    fetch("https://60d02d3b7de0b20017107d55.mockapi.io/todo/" + idDelete, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoading(true);
          setDeleteTodo(true);
        },
        (error) => {
          setIsLoading(true);
          setError(error);
        }
      );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <form className="add-task" onSubmit={handleCreate}>
          <input
            className="task-input"
            value={value}
            onChange={handleValueChange}
          />
          <button className="btn-icon">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </form>
        <ul className="list">
          {todoList.map((item) => {
            return (
              <li key={item.id}>
                {item.name}
                <span>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      handleUpdate(item.id);
                    }}
                  >
                    Sửa
                  </button>{" "}
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Xóa
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Todolist;
