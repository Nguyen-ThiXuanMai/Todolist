import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export const Example = () => {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [needLoadAgain, setNeedLoadAgain] = useState(false);
  const [editing, setEditing] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch("https://60d02d3b7de0b20017107d55.mockapi.io/todo", {
      method: "GET",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          const results = result.map((item) => {
            return { ...item, editing: false };
          });
          setTodoList(results);
          setIsLoading(false);
          setNeedLoadAgain(false);
        },
        (error) => {}
      );
  }, [needLoadAgain]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!editing) {
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
            setNeedLoadAgain(true);
            setValue("");
          },
          (error) => {}
        );
    } else {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value,
        }),
      };
      fetch(
        "https://60d02d3b7de0b20017107d55.mockapi.io/todo/" + editing,
        requestOptions
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setNeedLoadAgain(true);
            setValue("");
          },
          (error) => {}
        );
    }
  }

  function handleChange(e) {
    setValue(e.target.value);
  }

  function handleDelete(idDelete) {
    fetch("https://60d02d3b7de0b20017107d55.mockapi.io/todo/" + idDelete, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setNeedLoadAgain(true);
        },
        (error) => {}
      );
  }

  function handleEdit(item) {
    setValue(item.name);
    setEditing(item.id);
    const newTodolist = todoList.map((todo) => {
      return item.id === todo.id ? { ...todo, editing: true } : todo;
    });
    setTodoList(newTodolist);
  }

  function handleCancel() {
    setValue("");
    setNeedLoadAgain(true);
    setEditing(false);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label className="title-text" style={{ marginRight: 10 }}>
          To Do List
        </label>
        {isLoading && <div>Loading...</div>}
        <br />
      </div>
      <form className="add-task" onSubmit={handleSubmit}>
        <input
          className="task-input"
          placeholder="Create todo-list"
          value={value}
          onChange={handleChange}
        />
        <button className="btn-icon" type="submit">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>{" "}
      <ul className="list">
        {todoList.map((item) => {
          return (
            <li key={item.id}>
              {item.name}
              <span>
                {!item.editing && (
                  <button
                    className="btn-edit"
                    onClick={() => {
                      handleEdit(item);
                    }}
                  >
                    Edit
                  </button>
                )}

                {item.editing && "Fixing"}

                {item.editing && (
                  <button
                    className="btn-delete"
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    Cancel
                  </button>
                )}

                {!item.editing && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
