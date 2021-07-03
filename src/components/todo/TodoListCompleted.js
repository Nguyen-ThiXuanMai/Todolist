import React from "react";

const TodoListCompleted = () => {
  return (
    <FlipMove
      duration={600}
      easing="ease-in-out"
      // appearAnimation="fade"
      className={`list-todo-container ${show}`}
    >
      {arrayDid.map((item) => {
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
                    <ButtonComponent onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon
                        className="btn-delete"
                        icon={faTrashAlt}
                      />
                    </ButtonComponent>
                  )}

                  {item.editing && (
                    <ButtonComponent onClick={() => handleCancel()}>
                      <FontAwesomeIcon className="btn-delete" icon={faTimes} />
                    </ButtonComponent>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </FlipMove>
  );
};

export default TodoListCompleted;
