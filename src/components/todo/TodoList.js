import {
  faEdit,
  faPlus,
  faCheck,
  faTrashAlt,
  faTimes,
  faSpinner,
  faChevronDown,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./style.css";
import ButtonComponent from "../button/Button";
import FlipMove from "react-flip-move";
import { motion } from "framer-motion";

export const TodoList = () => {
  const [arrayDo, setArrayDo] = useState([]);
  const [arrayDid, setArrayDid] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [needLoadAgain, setNeedLoadAgain] = useState(false);
  const [editing, setEditing] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [undoTitle, setUndoTitle] = useState("");
  const [undoItem, setUndoItem] = useState("");
  const [undoTimer, setUndoTimer] = useState(0);
  const [undoEditItem, setUndoEditItem] = useState();
  const [undoEditTitle, setUndoEditTitle] = useState();

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

          // setTodoList(results);
          setArrayDo(results.filter((item) => item.status === "todo"));
          setArrayDid(results.filter((item) => item.status === "did"));
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
            setUndoTitle("Đã sửa: " + undoTitle);
            setUndoEditItem(editing);
            setUndoEditTitle(undoEditTitle);
            setNeedLoadAgain(true);
            setValue("");
            setEditing(false);
            setUndoTimer(5);
          },
          (error) => {
            setIsLoading(true);
          }
        );
    }
  }

  function handleDelete(item) {
    fetch("https://60d02d3b7de0b20017107d55.mockapi.io/todo/" + item.id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setUndoTitle("Đã xóa: " + item.name);
          setUndoItem(item);
          setIsLoading(true);
          setNeedLoadAgain(true);
          setUndoTimer(5);
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
    setUndoTitle(item.name);
    setUndoEditItem(item.id);
    setUndoEditTitle(item.name);
    const newTodolist = arrayDo.map((todo) => {
      return item.id === todo.id
        ? { ...todo, editing: true }
        : { ...todo, editing: false };
    });
    setArrayDo(newTodolist);
  }

  // useEffect(() => {
  //   if (value && refInput) refInput.current.focus();
  // }, [value]);

  function handleCancel() {
    setValue("");
    setNeedLoadAgain(true);
    setEditing(false);
  }

  function handleUndo() {
    if (!undoEditItem) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: undoItem.name,
        }),
      };
      fetch("https://60d02d3b7de0b20017107d55.mockapi.io/todo", requestOptions)
        .then((res) => res.json())
        .then(
          (result) => {
            setUndoItem("");
            setUndoTitle();
            setNeedLoadAgain(true);
            setName("");
            // message.success("")
          },
          (error) => {}
        );
    } else {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: undoEditTitle,
        }),
      };
      fetch(
        "https://60d02d3b7de0b20017107d55.mockapi.io/todo/" + undoEditItem,
        requestOptions
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setUndoTitle();
            setUndoEditItem();
            setUndoEditTitle();
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

  useEffect(() => {
    if (undoTimer > 0)
      setTimeout(() => {
        setUndoTimer(undoTimer - 1);
      }, 1000);
  }, [undoTimer]);

  return (
    <div className="container">
      <div
        className={`undo-container ${undoTitle && undoTimer > 0 ? "show" : ""}`}
      >
        <span className="undo-timer">{undoTimer > 0 ? undoTimer : ""}</span>
        <span style={{ margin: 4 }}>{undoTitle}</span>
        <button className="btn-undo" onClick={handleUndo}>
          <FontAwesomeIcon color="white" icon={faUndo} size="lg" />
        </button>
      </div>
      <div className="title">
        <motion.span
          initial={{ y: -200 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", duration: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          To Do List
        </motion.span>
        <div className="loading">
          {isLoading && (
            <FontAwesomeIcon icon={faSpinner} style={{ fontSize: 25 }} />
          )}
        </div>
      </div>

      <motion.form
        initial={{ y: -200 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", duration: 1 }}
        className="create-todo-container"
        style={{ position: "relative" }}
        onSubmit={handleSubmit}
      >
        <input
          onKeyDown={(event) => {
            //bắt sự kiện enter của input
            // if (event.keyCode === 13) {
            //   handleSubmit(event);
            // }
          }}
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
      </motion.form>
      <p className="title-length">You have {arrayDo.length} to do</p>
      <FlipMove
        duration={500}
        easing="ease-in-out"
        // appearAnimation="fade"
        className="list-todo-container"
      >
        {arrayDo.map((item) => {
          return (
            <div className="todo-container" key={item.id}>
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
                      <ButtonComponent onClick={() => handleDelete(item)}>
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
            </div>
          );
        })}
      </FlipMove>
      <p
        className="task-complete"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <FontAwesomeIcon
          className={`${
            isOpen ? "arrow-task-complete-open" : "arrow-task-complete-close"
          }`}
          icon={faChevronDown}
        />
        Tasks completed
      </p>

      <FlipMove
        duration={500}
        easing="cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        // appearAnimation="fade"
        className={`list-todo-container`}
      >
        {(isOpen ? arrayDid : []).map((item) => {
          return (
            <div className="todo-container" key={item.id}>
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
                <ButtonComponent onClick={() => handleDelete(item.id)}>
                  <FontAwesomeIcon className="btn-delete" icon={faTrashAlt} />
                </ButtonComponent>
              </div>
            </div>
          );
        })}
      </FlipMove>
    </div>
  );
};
