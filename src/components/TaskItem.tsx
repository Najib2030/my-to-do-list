import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/fireBase";

interface Props {
  task: { id: string; text: string; completed: boolean };
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  setTasks: (tasks: any[]) => void;
  tasks: any[];
}

function TaskItem({ task, onToggle, onDelete, setTasks, tasks }: Props) {
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
      onDoubleClick={() => setIsEditing(true)}
    >
      <div className="d-flex align-items-center">
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
            onBlur={handleEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
              if (e.key === "Escape") setIsEditing(false);
            }}
            autoFocus
          />
        ) : (
          <label
            htmlFor={`taskCheckbox-${task.id}`}
            style={{
              textDecoration: task.completed ? "line-through" : "none",
            }}
            onClick={() => setUpdatedTask(task.text)}
          >
            {task.text}
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
