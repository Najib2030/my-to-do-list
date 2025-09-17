import { auth, db } from "../config/fireBase";
import { useState } from "react";
import Share from "./Share";
import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
} from "firebase/firestore";

interface Props {
  setGlobalAlert: (message: string, type: "success" | "danger") => void;
  task: { id: string; text: string; completed: boolean };
  onDelete: (id: string, text: string) => void;
  setBackHeader: (header: string) => void;
  setHeader: (header: string) => void;
  setIdClicked: (id: string) => void;
  setTasks: (tasks: any[]) => void;
}

function TaskGroupItem({
  task,
  onDelete,
  setTasks,
  setHeader,
  setBackHeader,
  setIdClicked,
  setGlobalAlert,
}: Props) {
  const [updatedTask, setUpdatedTask] = useState(task.text);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [share, setShare] = useState(false);
  const isBusy = saving || deleting;

  const onEdit = async (id: string, updatedTask: string) => {
    setSaving(true);
    try {
      const oldRef = doc(db, `${auth?.currentUser?.email}`, id);

      const today = new Date();
      const newId = today.getTime().toString();

      const newRef = doc(db, `${auth?.currentUser?.email}`, newId);

      const snapshot = await getDocs(collection(oldRef, task.text));

      for (const d of snapshot.docs) {
        await setDoc(doc(newRef, updatedTask, d.id), d.data());
      }

      for (const d of snapshot.docs) {
        await deleteDoc(doc(oldRef, task.text, d.id));
      }

      setDoc(newRef, { text: updatedTask });
      await deleteDoc(oldRef);

      setGlobalAlert(
        `"${task.text}" renamed to "${updatedTask}" successfully`,
        "success"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (!updatedTask.trim()) {
      setUpdatedTask(task.text);
    } else {
      onEdit(task.id, updatedTask);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(task.id, task.text);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <li
        className={`list-group-item d-flex align-item-center justify-content-between mx-1 mt-2 ${
          isBusy ? "opacity-50" : ""
        }`}
        style={{
          border: "1px solid",
          borderRadius: "5px",
        }}
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
              disabled={isBusy}
            />
          </div>
        ) : (
          <>
            <div
              className="align-items-center"
              style={{
                width: "-webkit-fill-available",
                cursor: isBusy ? "not-allowed" : "pointer",
              }}
              onClick={() => {
                if (isBusy) return;
                setBackHeader("Task Notes");
                setHeader(task.text);
                setIdClicked(task.id);
              }}
            >
              <label style={{ cursor: isBusy ? "not-allowed" : "pointer" }}>
                {task.text}
              </label>
            </div>
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
          className="btn btn-sm btn-outline-danger me-1"
          onClick={handleDelete}
          disabled={isBusy}
        >
          {deleting ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            "Delete"
          )}
        </button>

        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setShare(!share)}
          disabled={isBusy}
        >
          Share
        </button>
      </li>

      {share && (
        <Share setShare={setShare} task={task} setAlert={setGlobalAlert} />
      )}
    </>
  );
}

export default TaskGroupItem;
