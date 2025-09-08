import TaskGroupItem from "./TaskGroupItem";
import {
  deleteDoc,
  doc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../config/fireBase";

interface Props {
  tasks: any[];
  setTasks: (tasks: any[]) => void;
  setClicked: (clicked: boolean) => void;
  setHeader: (header: string) => void;
  setIdClicked: (id: string) => void;
}

function TaskGroupList({
  tasks,
  setTasks,
  setClicked,
  setHeader,
  setIdClicked,
}: Props) {
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
  };

  if (tasks.length === 0) {
    return (
      <div className="alert alert-info">No tasks yet — add one above!</div>
    );
  }

  return (
    <ul className="list-group ">
      {tasks.map((task) => (
        <TaskGroupItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          setTasks={setTasks}
          tasks={tasks}
          setClicked={setClicked}
          setHeader={setHeader}
          setIdClicked={setIdClicked}
        />
      ))}
    </ul>
  );
}

export default TaskGroupList;
