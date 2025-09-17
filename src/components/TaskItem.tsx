import { doc, updateDoc } from "firebase/firestore";
import Textarea from "./Textarea";
import { useState } from "react";

interface Props {
  task: { id: string; task: string; completed: boolean; description: string };
  setGlobalAlert: (message: string, type: "success" | "danger") => void;
  onToggle: (id: string, text: string, completed: boolean) => void;
  onDelete: (id: string, text: string) => void;
  setTasks: (tasks: any[]) => void;
  tasksCollectionRef: any;
  backHeader: string;
  tasks: any[];
}

function TaskItem({
  tasksCollectionRef,
  setGlobalAlert,
  backHeader,
  onToggle,
  onDelete,
  setTasks,
  tasks,
  task,
}: Props) {
  const [completed, setCompleted] = useState(
    task.completed ? "Incompleted" : "Completed"
  );
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isBusy = saving || deleting || toggling;
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task.task);

  const onEdit = async (id: string, updatedTask: string) => {
    setSaving(true);
    try {
      const taskDoc = doc(tasksCollectionRef, id);
      await updateDoc(taskDoc, { task: updatedTask });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, task: updatedTask } : task
        )
      );

      setGlobalAlert(
        `"${task.task}" renamed to "${updatedTask}" successfully`,
        "success"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (!updatedTask.trim()) {
      setUpdatedTask(task.task);
    } else {
      onEdit(task.id, updatedTask);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(task.id, task.task);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(task.id, task.task, !task.completed);
    } finally {
      setToggling(false);
    }
    setCompleted(!task.completed ? "Incompleted" : "Completed");
  };

  return (
    <>
      <li
        className={`list-group-item d-flex align-item-center justify-content-between mx-1 mt-2 ${
          isBusy ? "opacity-50" : ""
        }`}
        style={{
          cursor: isBusy ? "not-allowed" : "pointer",
          border: "1px solid",
          borderRadius: "5px",
          backgroundColor: task.completed ? "#80fe72a8" : "",
        }}
      >
        {isEditing ? (
          <div
            className="align-items-center d-flex me-2"
            style={{ width: "-webkit-fill-available" }}
          >
            {/* <input
              id={`taskCheckbox-${task.id}`}
              type="checkbox"
              className="form-check-input me-2"
              checked={task.completed}
            /> */}
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
              disabled={isBusy}
            />
          </div>
        ) : (
          <>
            <div
              className="align-items-center d-flex"
              style={{ width: "-webkit-fill-available" }}
            >
              {/* <input
                type="checkbox"
                className="form-check-input me-2"
                checked={task.completed}
                onChange={() => handleToggle()}
              /> */}
              <label
                style={{
                  width: "-webkit-fill-available",
                  cursor: isBusy ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (isBusy) return;
                  setDescription(!description);
                }}
              >
                {task.task}
              </label>
            </div>
            <button
              className="btn btn-sm btn-outline-success me-1"
              onClick={handleToggle}
              disabled={isBusy}
            >
              {toggling ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                completed
              )}
            </button>
            <button
              className="btn btn-sm btn-outline-danger me-1"
              onClick={() => setIsEditing(true)}
              disabled={isBusy}
            >
              {saving ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                "Edit"
              )}
            </button>
          </>
        )}
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={handleDelete}
          disabled={isBusy}
        >
          {deleting ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            "Delete"
          )}
        </button>
      </li>
      {description ? (
        <Textarea
          task={task}
          backHeader={backHeader}
          setTasks={setTasks}
          tasks={tasks}
          tasksCollectionRef={tasksCollectionRef}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default TaskItem;
