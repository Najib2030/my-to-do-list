import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../config/fireBase";
import TaskItem from "./TaskItem";
import { useState } from "react";
import {
  getDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";

interface Props {
  tasks: any[];
  title: string;
  groupId: string;
  backHeader: string;
  tasksCollectionRef: any;
  setTasks: (tasks: any[]) => void;
}

function TaskList({
  tasks,
  title,
  groupId,
  setTasks,
  backHeader,
  tasksCollectionRef,
}: Props) {
  const [globalAlert, setGlobalAlertState] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  const setGlobalAlert = (message: string, type: "success" | "danger") => {
    setGlobalAlertState({ message, type });
    setTimeout(() => setGlobalAlertState(null), 4000);
  };

  const onToggle = async (id: string, text: string, completed: boolean) => {
    const taskDoc = doc(tasksCollectionRef, id);
    await updateDoc(taskDoc, { completed: completed });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    {
      completed &&
        setGlobalAlert(`"${text}" completed successfully`, "success");
    }
  };

  const onTrash = async (id: string, text: string) => {
    const copyRef = doc(db, `${auth?.currentUser?.email}`, groupId, title, id);
    const pastRef1 = doc(
      db,
      `${auth?.currentUser?.email}`,
      groupId,
      title,
      "trash"
    );

    const snapCopy = await getDoc(copyRef);
    const snapPast1 = await getDoc(pastRef1);

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const collectionName = `${day}-${month}-${year}`;
    const newId = today.getTime().toString();

    await setDoc(doc(pastRef1, collectionName, newId), snapCopy.data());

    if (!snapPast1.exists()) {
      await setDoc(pastRef1, { collections: arrayUnion(collectionName) });
    } else {
      await updateDoc(pastRef1, { collections: arrayUnion(collectionName) });
    }

    await onDelete(id, text);
  };

  const onDelete = async (id: string, text: string) => {
    const taskDoc = doc(tasksCollectionRef, id);
    await deleteDoc(taskDoc);
    setTasks(tasks.filter((t) => t.id !== id));
    setGlobalAlert(`"${text}" deleted successfully`, "danger");
  };

  return (
    <div style={{ paddingBottom: "115px" }}>
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

      <ul className="list-group ">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onTrash}
            setTasks={setTasks}
            tasks={tasks}
            backHeader={backHeader}
            tasksCollectionRef={tasksCollectionRef}
            setGlobalAlert={setGlobalAlert}
          />
        ))}

        {tasks.length === 0 ? (
          <div className="alert alert-info text-center">
            No tasks yet — add one above!
          </div>
        ) : (
          <sub
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "10px",
              color: "#6c757d",
              fontSize: "14px",
            }}
          >
            click on a task to describe it.
          </sub>
        )}
      </ul>
    </div>
  );
}

export default TaskList;
