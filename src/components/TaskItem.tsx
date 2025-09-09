import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/fireBase";
import Textarea from "./Textarea";

interface Props {
  task: { id: string; task: string; completed: boolean; description: string };
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
  const [description, setDescription] = useState(false);

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
      setUpdatedTask(task.task);
    } else {
      onEdit(task.id, updatedTask);
    }
    setIsEditing(false);
  };

  return (
    <>
      <li
        className="list-group-item d-flex align-item-center justify-content-between mx-1 mt-2"
        style={{ cursor: "pointer", border: "1px solid", borderRadius: "5px" }}
      >
        {isEditing ? (
          <div
            className="align-items-center d-flex me-2"
            style={{ width: "-webkit-fill-available" }}
          >
            <input
              id={`taskCheckbox-${task.id}`}
              type="checkbox"
              className="form-check-input me-2"
              checked={task.completed}
            />
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
              autoFocus
            />
          </div>
        ) : (
          <div
            className="align-items-center d-flex"
            style={{ width: "-webkit-fill-available" }}
          >
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={task.completed}
              onChange={() => onToggle(task.id, !task.completed)}
            />
            <label
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                width: "-webkit-fill-available",
                cursor: "pointer",
              }}
              onClick={() => setDescription(!description)}
            >
              {task.task}
            </label>
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
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </li>
      {description ? (
        <Textarea
          task={task}
          setTasks={setTasks}
          tasks={tasks}
          title={title}
          groupId={groupId}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default TaskItem;
