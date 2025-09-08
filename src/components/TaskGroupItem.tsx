import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/fireBase";

interface Props {
  task: { id: string; text: string; completed: boolean };
  onDelete: (id: string, text: string) => void;
  setClicked: (clicked: boolean) => void;
  setHeader: (header: string) => void;
  setIdClicked: (id: string) => void;
  setTasks: (tasks: any[]) => void;
  tasks: any[];
}

function TaskItem({
  task,
  tasks,
  onDelete,
  setTasks,
  setHeader,
  setClicked,
  setIdClicked,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task.text);

  const onEdit = async (id: string, updatedTask: string) => {
    const taskDoc = doc(db, `${auth?.currentUser?.email}`, id);
    await updateDoc(taskDoc, { text: updatedTask });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: updatedTask } : task
      )
    );
  };

  const handleEdit = () => {
    if (!updatedTask.trim()) {
    } else {
      onEdit(task.id, updatedTask);
    }
    setIsEditing(false);
  };

  return (
    <li
      className="list-group-item d-flex align-item-center justify-content-between"
      style={{ cursor: "pointer" }}
    >
      {isEditing ? (
        <div
          className="align-items-center me-2"
          style={{ width: "-webkit-fill-available" }}
        >
          <input
            className="form-control"
            value={updatedTask}
            onChange={(e) => setUpdatedTask(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              setUpdatedTask(task.text);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
              if (e.key === "Escape") {
                setIsEditing(false);
                setUpdatedTask(task.text);
              }
            }}
            autoFocus
          />
        </div>
      ) : (
        <div
          className="align-items-center"
          style={{ width: "-webkit-fill-available" }}
          onClick={() => {
            setClicked(false);
            setHeader(task.text);
            setIdClicked(task.id);
          }}
        >
          <label>{task.text}</label>
        </div>
      )}
      <button
        className="btn btn-sm btn-outline-danger me-1"
        onClick={() => setIsEditing(true)}
      >
        edit
      </button>
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={() => onDelete(task.id, task.text)}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;
