import { auth, db } from "../config/fireBase";
import { useState } from "react";
import {
  arrayRemove,
  collection,
  deleteDoc,
  updateDoc,
  getDocs,
  setDoc,
  getDoc,
  query,
  where,
  doc,
} from "firebase/firestore";

interface Props {
  header: string;
  subCollection: string;
  shareCollection: string;
  collectionIndex: number;
  allSharedTasksGroups: any[];
  setIdClicked: (id: string) => void;
  setHeader: (header: string) => void;
  setBackHeader: (backHeader: string) => void;
  setAllSharedTasksGroups: (tasks: any[]) => void;
  setSubCollection: (collection: string) => void;
  task: { id: string; text: string; completed: boolean };
  setGlobalAlert: (message: string, type: "success" | "danger") => void;
}

function TrashGroupItem({
  setAllSharedTasksGroups,
  allSharedTasksGroups,
  setSubCollection,
  shareCollection,
  collectionIndex,
  setGlobalAlert,
  subCollection,
  setBackHeader,
  setIdClicked,
  setHeader,
  header,
  task,
}: Props) {
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const isBusy = saving || deleting;

  const onDelete = async (id: string, text: string) => {
    const tasksRef = doc(
      db,
      `${auth?.currentUser?.email}/${shareCollection}/${subCollection}/${id}`
    );
    const snapshot = await getDocs(collection(tasksRef, text));
    const promises = snapshot.docs.map((taskDoc) =>
      deleteDoc(doc(tasksRef, text, taskDoc.id))
    );
    await Promise.all(promises);

    await deleteDoc(tasksRef);

    setAllSharedTasksGroups(
      allSharedTasksGroups.map((group, index) =>
        index === collectionIndex
          ? group.filter((t: { id: string }) => t.id !== id)
          : group
      )
    );

    if (allSharedTasksGroups[collectionIndex].length === 1) {
      const docRef = doc(db, `${auth.currentUser?.email}`, shareCollection);
      await updateDoc(docRef, {
        collections: arrayRemove(subCollection),
      });
    }

    const coll = doc(db, `${auth.currentUser?.email}`, shareCollection);
    const docf = await getDoc(coll);
    const docfData = docf.data();
    if (docfData && docfData.collections && docfData.collections.length === 0) {
      deleteDoc(coll);
    }
  };

  const onSave = async (id: string) => {
    setSaving(true);
    try {
      const copyRef = doc(db, `${auth?.currentUser?.email}`, shareCollection);

      const pastRef = collection(db, `${auth?.currentUser?.email}`);

      const today = new Date();
      const newId = today.getTime().toString();

      const q = query(
        pastRef,
        where("text", ">=", task.text),
        where("text", "<=", task.text + "\uf8ff")
      );
      const existingSnap = await getDocs(q);

      let finalText = task.text;
      let counter = 1;

      while (existingSnap.docs.some((d) => d.data().text === finalText)) {
        finalText = `${task.text}${counter}`;
        counter++;
      }

      const snapCopy = await getDocs(
        collection(copyRef, subCollection, id, task.text)
      );

      for (const d of snapCopy.docs) {
        await setDoc(doc(pastRef, newId, finalText, d.id), d.data());
      }

      await setDoc(doc(pastRef, newId), { text: finalText });

      await onDelete(id, task.text);

      const docf = await getDoc(copyRef);
      const docfData = docf.data();
      if (
        docfData &&
        docfData.collections &&
        docfData.collections.length === 0
      ) {
        deleteDoc(copyRef);
      }

      setGlobalAlert(`"${task.text}" restored successfully`, "success");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(task.id, task.text);
      setGlobalAlert(`"${task.text}" deleted successfully`, "danger");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center mx-1 mt-2 ${
        isBusy ? "opacity-50" : ""
      }`}
      style={{
        border: "1px solid",
        borderRadius: "5px",
      }}
    >
      <div
        className="align-items-center"
        style={{
          width: "-webkit-fill-available",
          cursor: isBusy ? "not-allowed" : "pointer",
        }}
        onClick={() => {
          if (isBusy) return;
          setSubCollection(subCollection);
          setBackHeader(header);
          setHeader(task.text);
          setIdClicked(task.id);
        }}
      >
        <label style={{ cursor: isBusy ? "not-allowed" : "pointer" }}>
          {task.text}
        </label>
      </div>

      <div className="d-flex">
        <button
          className="btn btn-sm btn-outline-danger me-1"
          onClick={handleDelete}
          disabled={deleting}
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
      </div>
    </li>
  );
}

export default TrashGroupItem;
