import { auth, db } from "../config/fireBase";
import TrashTextarea from "./TrashTextarea";
import { useState } from "react";
import {
  arrayRemove,
  collection,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  doc,
} from "firebase/firestore";

interface Props {
  task: { id: string; task: string; completed: boolean; description: string };
  setGlobalAlert: (message: string, type: "success" | "danger") => void;
  setAllSharedTasksGroups: (tasks: any[]) => void;
  setSubCollection: (collection: string) => void;
  setBackHeader: (backHeader: string) => void;
  setHeader: (header: string) => void;
  setIdClicked: (id: string) => void;
  allSharedTasksGroups: any[];
  collectionIndex: number;
  subCollection: string;
  backHeader: string;
  groupId: string;
}

function TasksTrashItem({
  setAllSharedTasksGroups,
  allSharedTasksGroups,
  setSubCollection,
  collectionIndex,
  setGlobalAlert,
  subCollection,
  setBackHeader,
  setIdClicked,
  backHeader,
  setHeader,
  groupId,
  task,
}: Props) {
  const [description, setDescription] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const isBusy = saving || deleting;

  const onDelete = async (id: string, text: string) => {
    const tasksRef = doc(
      db,
      `${auth?.currentUser?.email}/${groupId}/${backHeader}/trash/${subCollection}/${id}`
    );

    await deleteDoc(tasksRef);

    setAllSharedTasksGroups(
      allSharedTasksGroups.map((group, index) =>
        index === collectionIndex
          ? group.filter((t: { id: string }) => t.id !== id)
          : group
      )
    );

    if (allSharedTasksGroups[collectionIndex].length === 1) {
      const docRef = doc(
        db,
        `${auth.currentUser?.email}`,
        groupId,
        backHeader,
        "trash"
      );
      await updateDoc(docRef, {
        collections: arrayRemove(subCollection),
      });
    }

    const coll = doc(
      db,
      `${auth.currentUser?.email}`,
      groupId,
      backHeader,
      "trash"
    );
    const docf = await getDoc(coll);
    const docfData = docf.data();
    if (docfData && docfData.collections && docfData.collections.length === 0) {
      deleteDoc(coll);
    }
  };

  const onSave = async (id: string) => {
    setSaving(true);
    try {
      const copyRef = doc(
        db,
        `${auth?.currentUser?.email}`,
        groupId,
        backHeader,
        "trash"
      );

      const pastRef = collection(
        db,
        `${auth?.currentUser?.email}`,
        groupId,
        backHeader
      );

      const today = new Date();
      const newId = today.getTime().toString();

      const q = query(
        pastRef,
        where("task", ">=", task.task),
        where("task", "<=", task.task + "\uf8ff")
      );
      const existingSnap = await getDocs(q);

      let finalText = task.task;
      let counter = 1;

      while (existingSnap.docs.some((d) => d.data().task === finalText)) {
        finalText = `${task.task}${counter}`;
        counter++;
      }

      const snapCopy = await getDoc(doc(copyRef, subCollection, id));

      await setDoc(doc(pastRef, newId), snapCopy.data());

      await updateDoc(doc(pastRef, newId), { task: finalText });

      await onDelete(id, task.task);

      const docf = await getDoc(copyRef);
      const docfData = docf.data();
      if (
        docfData &&
        docfData.collections &&
        docfData.collections.length === 0
      ) {
        deleteDoc(copyRef);
      }

      setGlobalAlert(`"${task.task}" restored successfully`, "success");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(task.id, task.task);
      setGlobalAlert(`"${task.task}" deleted successfully`, "danger");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <li
        className={`list-group-item d-flex justify-content-between align-items-center mx-1 mt-2 ${
          isBusy ? "opacity-50" : ""
        }`}
        style={{
          cursor: isBusy ? "not-allowed" : "pointer",
          border: "1px solid",
          borderRadius: "5px",
          backgroundColor: task.completed ? "#80fe72a8" : "",
        }}
      >
        <div
          className="align-items-center"
          style={{ width: "-webkit-fill-available" }}
        >
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
          className="btn btn-sm btn-outline-danger me-1"
          onClick={handleDelete}
          disabled={isBusy}
        >
          {deleting ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "Delete"
          )}
        </button>

        <button
          className="btn btn-sm btn-info"
          onClick={() => onSave(task.id)}
          disabled={saving}
        >
          {saving ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "Restore"
          )}
        </button>
      </li>
      {description ? <TrashTextarea task={task} /> : ""}
    </>
  );
}

export default TasksTrashItem;
