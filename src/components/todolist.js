import {
  faEdit,
  faPlus,
  faCheck,
  faTrashAlt,
  faTimes,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./style.css";
import ButtonComponent from "./ButtonComponent";
import FlipMove from "react-flip-move";

export const TodoList = () => {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [needLoadAgain, setNeedLoadAgain] = useState(false);
  const [editing, setEditing] = useState("");

  // const refInput = useRef(null);

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
        (error) => {
          setIsLoading(false);
        }
      );
  }, [needLoadAgain]);

  function handleValueCreate(e) {
    setName(e.target.value);
  }

  function handleValueChange(e) {
    setValue(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!editing) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
        }),
      };
      fetch("https://60d02d3b7de0b20017107d55.mockapi.io/todo", requestOptions)
        .then((res) => res.json())
        .then(
          (result) => {
            setNeedLoadAgain(true);
            setName("");
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
            setEditing(false);
          },
          (error) => {
            setIsLoading(true);
          }
        );
    }
  }

  function handleDelete(idDelete) {
    fetch("https://60d02d3b7de0b20017107d55.mockapi.io/todo/" + idDelete, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoading(true);
          setNeedLoadAgain(true);
        },
        (error) => {
          setIsLoading(true);
        }
      );
  }

  function handleClickToDo(item) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: item.status === "did" ? "todo" : "did",
      }),
    };
    fetch(
      "https://60d02d3b7de0b20017107d55.mockapi.io/todo/" + item.id,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setNeedLoadAgain(true);
          setValue("");
          setEditing(false);
        },
        (error) => {
          setIsLoading(true);
        }
      );
  }

  function handleEdit(item) {
    setValue(item.name);
    setEditing(item.id);
    const newTodolist = todoList.map((todo) => {
      return item.id === todo.id
        ? { ...todo, editing: true }
        : { ...todo, editing: false };
    });
    setTodoList(newTodolist);
  }

  // useEffect(() => {
  //   if (value && refInput) refInput.current.focus();
  // }, [value]);

  function handleCancel() {
    setValue("");
    setNeedLoadAgain(true);
    setEditing(false);
  }

  return (
    <div className="container">
      <div className="title">
        <span>To Do List</span>
        <div className="loading">
          {isLoading && (
            <FontAwesomeIcon icon={faSpinner} style={{ fontSize: 25 }} />
          )}
        </div>
      </div>

      <form
        className="create-todo-container"
        style={{ position: "relative" }}
        onSubmit={handleSubmit}
      >
        <input
          className="input-style"
          value={name}
          placeholder="Add new todo"
          onChange={handleValueCreate}
          required
        />
        <button
          className="btn-add-todo"
          style={{ position: "absolute", right: 0 }}
          type="submit"
        >
          <FontAwesomeIcon
            style={{ color: "#fff", fontSize: 16 }}
            icon={faPlus}
          />
        </button>
      </form>
      <div className="list-todo-container">
        {todoList.map((item) => {
          return (
            <FlipMove
              duration={1000}
              easing="ease-in-out"
              className="todo-container"
              key={item.id}
            >
              <div className="todo-content">
                {!item.editing && (
                  <>
                    <input
                      onClick={() => handleClickToDo(item)}
                      type="checkbox"
                      className="checkbox-style"
                      checked={item.status === "did" ? true : false}
                    />
                    <div
                      onClick={() => handleClickToDo(item)}
                      className={`${item.status === "did" ? "todo-did" : ""}`}
                    >
                      {item.name}
                    </div>
                  </>
                )}
                {item.editing && (
                  <input
                    className="edit-input-style"
                    value={value}
                    onChange={handleValueChange}
                    autoFocus
                  />
                )}
              </div>

              <div className="todo-action">
                {item.status === "todo" && (
                  <>
                    {!item.editing && (
                      <ButtonComponent
                        style={{ marginRight: 4 }}
                        onClick={() => {
                          handleEdit(item);
                        }}
                      >
                        <FontAwesomeIcon className="btn-edit" icon={faEdit} />
                      </ButtonComponent>
                    )}
                    {item.editing && (
                      <ButtonComponent
                        style={{ marginRight: 4 }}
                        onClick={handleSubmit}
                      >
                        <FontAwesomeIcon className="btn-edit" icon={faCheck} />
                      </ButtonComponent>
                    )}

                    {!item.editing && (
                      <ButtonComponent onClick={() => handleDelete(item.id)}>
                        <FontAwesomeIcon
                          className="btn-delete"
                          icon={faTrashAlt}
                        />
                      </ButtonComponent>
                    )}

                    {item.editing && (
                      <ButtonComponent onClick={() => handleCancel()}>
                        <FontAwesomeIcon
                          className="btn-delete"
                          icon={faTimes}
                        />
                      </ButtonComponent>
                    )}
                  </>
                )}
              </div>
            </FlipMove>
          );
        })}
      </div>
    </div>
  );
};
