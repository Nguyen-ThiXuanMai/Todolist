import React, { useEffect, useState } from "react";
import {
  faCheck,
  faEdit,
  faSpinner,
  faTimes,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../App.css";

function Todolist() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [needLoadAgain, setNeedLoadAgain] = useState(false);
  const [editing, setEditing] = useState(""); //khi cần xác định dòng nào đang sửa

  //Get Todolist
  useEffect(() => {
    setIsLoading(true);
    fetch("https://60d02d3b7de0b20017107d55.mockapi.io/todo", {
      method: "GET",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTodoList(result);
          setNeedLoadAgain(false);
          setIsLoading(false);
        },
        (error) => {
          setIsLoading(false);
          setError(error);
        }
      );
  }, [needLoadAgain]);

  function handleValueCreate(e) {
    setName(e.target.value);
  }

  function handleValueChange(e) {
    setValue(e.target.value);
  }

  //Create item
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
          (error) => {
            setError(error);
          }
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
            setError(error);
          }
        );
    }
  }

  //Update item
  function handleUpdate(item) {
    //đổ dữ liệu hiện có lên input
    setValue(item.name);
    //set editing bằng true để đổi icon
    setEditing(item.id);
    //map lại todolist để hiện thị phần tử đang được sửa, đánh dấu ptu đang đc sửa
    const newTodolist = todoList.map((todo) => {
      return item.id === todo.id
        ? { ...todo, editing: true }
        : { ...todo, editing: false };
    });
    setTodoList(newTodolist);
    //
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
          setNeedLoadAgain(true);
        },
        (error) => {
          setIsLoading(true);
          setError(error);
        }
      );
  }

  function handleCancel() {
    //đổ dữ liệu hiện có lên input
    setValue("");
    setNeedLoadAgain(true);
    setEditing(false);
    //
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
          setError(error);
        }
      );
  }

  return (
    <div>
      <img
        style={{ height: 150, marginLeft: "40%" }}
        src="./images/logo-todolist.png"
      />
      <div style={{ marginLeft: "40%", marginBottom: 20 }}>
        <label className="title-text">To Do List 😍😘😍</label>
        {error && <alert>Error: {error.message}</alert>}
        {isLoading && (
          <FontAwesomeIcon icon={faSpinner} style={{ fontSize: 25 }} />
        )}
      </div>
      <form className="create-todoList" onSubmit={handleSubmit}>
        <input
          className="input-todoList"
          value={name}
          placeholder="✍ Add todo ..."
          onChange={handleValueCreate}
          required
        />
        {/* <button className="btn-icon" type="submit"> */}
        {/* <FontAwesomeIcon icon={editing ? faSave : faPlus} /> */}
        {/* <FontAwesomeIcon icon={faPlus} />
        </button> */}
      </form>{" "}
      <ul className="list-todo">
        {todoList.map((item) => {
          return (
            <div>
              <li key={item.id} onClick={() => handleClickToDo(item)}>
                <input
                  type="checkbox"
                  className="box-check"
                  checked={item.status === "did" ? true : false} //number, undefined, null, 0 --> true false/ {}, "" -> true
                />

                {!item.editing && (
                  <label
                    className={`title-todo ${
                      item.status === "did" ? "todo-did" : ""
                    }`} // công thức: `... ${} ... ` viết phương thức bên trong
                    // className="title-todo"
                    // style={{
                    //   textDecoration:
                    //     item.status === "did" ? "line-through" : "",
                    // }}
                  >
                    {item.name}
                  </label>
                )}
              </li>
              {item.editing && (
                <input
                  className="edit-todo"
                  value={value}
                  onChange={handleValueChange}
                  required
                />
              )}
              <span>
                {!item.editing && (
                  // <button
                  //   className="btn-edit"
                  //   onClick={() => {
                  //     handleUpdate(item);
                  //   }}
                  // >
                  //   Edit
                  // </button>
                  <FontAwesomeIcon
                    className="icon-edit"
                    icon={faEdit}
                    onClick={() => {
                      handleUpdate(item);
                    }}
                    style={{ fontSize: 25 }}
                  />
                )}
                {item.editing && (
                  // <button className="btn-edit" onClick={handleSubmit}>
                  //   Save
                  // </button>
                  <FontAwesomeIcon
                    className="icon-edit"
                    icon={faCheck}
                    onClick={handleSubmit}
                    style={{ fontSize: 25 }}
                  />
                )}

                {item.editing && (
                  // <button className="btn-delete" onClick={() => handleCancel()}>
                  //   Cancel
                  // </button>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="icon-delete"
                    onClick={() => handleCancel()}
                    style={{ fontSize: 25 }}
                  />
                )}
                {!item.editing && (
                  // <button
                  //   className="btn-delete"
                  //   onClick={() => handleDelete(item.id)}
                  // >
                  //   Delete
                  // </button>
                  <FontAwesomeIcon
                    className="icon-delete"
                    icon={faTrashAlt}
                    onClick={() => handleDelete(item.id)}
                    style={{ fontSize: 25 }}
                  />
                )}
              </span>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default Todolist;
