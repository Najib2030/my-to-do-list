import { useState } from "react";
import {
  arrayRemove,
  collection,
  arrayUnion,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import { auth, db } from "../config/fireBase";

interface Props {
  header: string;
  subCollection: string;
  collectionIndex: number;
  shareCollection: string;
  allSharedTasksGroups: any[];
  setIdClicked: (id: string) => void;
  setHeader: (header: string) => void;
  setBackHeader: (header: string) => void;
  setSubCollection: (collection: string) => void;
  setAllSharedTasksGroups: (tasks: any[]) => void;
  task: { id: string; text: string; completed: boolean };
  setGlobalAlert: (message: string, type: "success" | "danger") => void;
}

function SharedGroupItem({
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

  const onTrash = async (id: string, text: string) => {
    const copyRef = collection(
      db,
      `${auth?.currentUser?.email}`,
      shareCollection,
      subCollection,
      id,
      text
    );
    const pastRef1 = doc(
      db,
      `${auth?.currentUser?.email}`,
      "trash",
      "trash",
      shareCollection
    );

    const snapCopy = await getDocs(copyRef);
    const snapPast1 = await getDoc(pastRef1);

    const today = new Date();
    const newId = today.getTime().toString();

    for (const d of snapCopy.docs) {
      await setDoc(doc(pastRef1, subCollection, newId, text, d.id), d.data());
    }

    if (!snapPast1.exists()) {
      await setDoc(pastRef1, { collections: arrayUnion(subCollection) });
    } else {
      await updateDoc(pastRef1, { collections: arrayUnion(subCollection) });
    }

    const pastDoc1 = doc(pastRef1, subCollection, newId);
    await setDoc(pastDoc1, { text: text });

    await onDelete(id, text);
  };

  const onDelete = async (id: string, text: string) => {
    try {
      const tasksRef = collection(
        db,
        `${auth?.currentUser?.email}/${shareCollection}/${subCollection}/${id}/${text}`
      );
      const snapshot = await getDocs(tasksRef);
      const promises = snapshot.docs.map((taskDoc) =>
        deleteDoc(doc(tasksRef, taskDoc.id))
      );
      await Promise.all(promises);

      const taskDoc = doc(
        db,
        `${auth?.currentUser?.email}`,
        shareCollection,
        subCollection,
        id
      );
      await deleteDoc(taskDoc);

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
      if (
        docfData &&
        docfData.collections &&
        docfData.collections.length === 0
      ) {
        deleteDoc(coll);
        console.log("deleted");
      }

      setGlobalAlert(`"${task.text}" deleted successfully`, "danger");
    } finally {
      setDeleting(false);
    }
  };

  const onSave = async (id: string) => {
    setSaving(true);
    try {
      const copyRef = collection(
        db,
        `${auth?.currentUser?.email}`,
        shareCollection,
        subCollection,
        id,
        task.text
      );

      const pastRef = collection(db, `${auth?.currentUser?.email}`);
      const newDocRef = doc(pastRef);

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

      const snapCopy = await getDocs(copyRef);

      for (const d of snapCopy.docs) {
        await setDoc(doc(pastRef, newDocRef.id, finalText, d.id), d.data());
      }

      await setDoc(doc(pastRef, newDocRef.id), { text: finalText });
      setGlobalAlert(`"${task.text}" saved successfully`, "success");
    } finally {
      setSaving(false);
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
          if (isBusy) return null;
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
          onClick={() => {
            onTrash(task.id, task.text);
            setDeleting(true);
          }}
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

        {header === "Task groups shared with you" && (
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
              "Save"
            )}
          </button>
        )}
      </div>
    </li>
  );
}

export default SharedGroupItem;
