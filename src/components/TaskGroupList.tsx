import { db, auth } from "../config/fireBase";
import TaskGroupItem from "./TaskGroupItem";
import { useState } from "react";
import {
  collection,
  arrayUnion,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";

interface Props {
  setBackHeader: (backHeader: string) => void;
  setHeader: (header: string) => void;
  setIdClicked: (id: string) => void;
  setTasks: (tasks: any[]) => void;
  tasks: any[];
}

function TaskGroupList({
  tasks,
  setTasks,
  setHeader,
  setIdClicked,
  setBackHeader,
}: Props) {
  const [globalAlert, setGlobalAlertState] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  const setGlobalAlert = (message: string, type: "success" | "danger") => {
    setGlobalAlertState({ message, type });
    setTimeout(() => setGlobalAlertState(null), 4000);
  };

  const onTrash = async (id: string, text: string) => {
    const copyRef = collection(db, `${auth?.currentUser?.email}`, id, text);
    const pastRef1 = doc(db, `${auth?.currentUser?.email}`, "trash/trash/trash");

    const snapCopy = await getDocs(copyRef);
    const snapPast1 = await getDoc(pastRef1);

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const collectionName = `${day}-${month}-${year}`;
    const newId = today.getTime().toString();

    for (const d of snapCopy.docs) {
      await setDoc(doc(pastRef1, collectionName, newId, text, d.id), d.data());
    }

    if (!snapPast1.exists()) {
      await setDoc(pastRef1, { collections: arrayUnion(collectionName) });
    } else {
      await updateDoc(pastRef1, { collections: arrayUnion(collectionName) });
    }

    const pastDoc1 = doc(pastRef1, collectionName, newId);
    await setDoc(pastDoc1, { text: text });

    await onDelete(id, text);
  };

  const onDelete = async (id: string, text: string) => {
    const tasksRef = collection(
      db,
      `${auth?.currentUser?.email}/${id}/${text}`
    );
    const snapshot = await getDocs(tasksRef);
    const promises = snapshot.docs.map((taskDoc) =>
      deleteDoc(
        doc(db, `${auth?.currentUser?.email}/${id}/${text}/${taskDoc.id}`)
      )
    );
    await Promise.all(promises);
    const taskDoc = doc(db, `${auth?.currentUser?.email}`, id);
    await deleteDoc(taskDoc);

    setTasks(tasks.filter((t) => t.id !== id));
    setGlobalAlert(`"${text}" deleted successfully`, "danger");
  };

  return (
    <div style={{ paddingBottom: "150px" }}>
      {globalAlert && (
        <div
          className={`alert alert-${globalAlert.type} text-center`}
          role="alert"
          style={{
            position: "fixed",
            top: "10px",
            right: "0",
            transform: globalAlert ? "translateX(0)" : "translateX(120%)",
            transition: "transform 2.5s ease, opacity 2.5s ease",
            opacity: globalAlert ? 1 : 0,
            zIndex: 2000,
            width: "auto",
            maxWidth: "90%",
            borderRadius: "25px 0 0 25px",
          }}
        >
          {globalAlert.message}
        </div>
      )}

      {tasks.length === 0 && (
        <div className="alert alert-info text-center">
          No groups yet — add one above!
        </div>
      )}

      <ul className="list-group">
        {tasks.map((task) => (
          <TaskGroupItem
            key={task.id}
            task={task}
            onDelete={onTrash}
            setTasks={setTasks}
            setHeader={setHeader}
            setBackHeader={setBackHeader}
            setIdClicked={setIdClicked}
            setGlobalAlert={setGlobalAlert}
          />
        ))}

      {tasks.length !== 0 && (
        <sub
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "10px",
            color: "#6c757d",
            fontSize: "14px",
          }}
        >
          click on a title to view the tasks.
        </sub>
      )}
      </ul>
    </div>
  );
}

export default TaskGroupList;
