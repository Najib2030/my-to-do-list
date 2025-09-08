import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/fireBase";

interface Props {
  task: { id: string; task: string; completed: boolean };
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  setTasks: (tasks: any[]) => void;
  tasks: any[];
  title: string;
  groupId: string;
}

function TaskItem({
  task,
  onToggle,
  onDelete,
  setTasks,
  tasks,
  groupId,
  title,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task.task);

  const onEdit = async (id: string, updatedTask: string) => {
    const taskDoc = doc(
      db,
      `${auth?.currentUser?.email}/${groupId}/${title}/${id}`
    );
    await updateDoc(taskDoc, { task: updatedTask });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, task: updatedTask } : task
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
      onDoubleClick={() => setIsEditing(true)}
    >
      <div
        className="align-items-center d-flex me-2"
        style={{ width: "-webkit-fill-available" }}
      >
        <input
          id={`taskCheckbox-${task.id}`}
          type="checkbox"
          className="form-check-input me-2"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
        />
        {isEditing ? (
          <input
            className="form-control"
            value={updatedTask}
            onChange={(e) => setUpdatedTask(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              setUpdatedTask(task.task);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
              if (e.key === "Escape") {
                setIsEditing(false);
                setUpdatedTask(task.task);
              }
            }}
            style={{ width: "-webkit-fill-available" }}
            autoFocus
          />
        ) : (
          <label
            htmlFor={`taskCheckbox-${task.id}`}
            style={{
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            {task.task}
          </label>
        )}
      </div>
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;
