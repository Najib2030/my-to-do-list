import { getDocs, doc, collection } from "firebase/firestore";
import SharedGroupList from "./components/SharedGroupList";
import TrashGroupList from "./components/TrashGroupList";
import TasksTrashList from "./components/TasksTrashList";
import TaskGroupForm from "./components/TaskGroupForm";
import TaskGroupList from "./components/TaskGroupList";
import TrashSharedGL from "./components/TrashSharedGL";
import SharedList from "./components/SharedList";
import { auth, db } from "./config/fireBase";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";

interface Props {
  setIsAuthenticated: (isAuth: boolean) => void;
}

const MainApp = ({ setIsAuthenticated }: Props) => {
  const [share, setShare] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [header, setHeader] = useState("Task Notes");
  const [backHeader, setBackHeader] = useState(header);
  const [subCollection, setSubCollection] = useState("");
  const [blockIndex, setBlockIndex] = useState("block2");
  const [tasksGroup, setTasksGroup] = useState<any[]>([]);
  const [idClicked, setIdClicked] = useState(`${tasksGroup[0]?.id}`);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const tasksGroupCollectionRef = collection(db, `${auth?.currentUser?.email}`);

  const getTasksGroup = async () => {
    const data = await getDocs(tasksGroupCollectionRef);
    const filteredData = data.docs
      .filter(
        (doc) =>
          doc.id !== "shared-with-you" &&
          doc.id !== "shared-from-you" &&
          doc.id !== "trash"
      )
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    setTasksGroup(filteredData);
  };

  const tasksCollectionRef =
    backHeader === "Task Notes"
      ? collection(db, `${auth?.currentUser?.email}`, idClicked, header)
      : collection(
          doc(
            db,
            `${auth?.currentUser?.email}`,
            share,
            subCollection,
            `${idClicked}`
          ),
          `${header}`
        );

  const getTasks = async () => {
    const data = await getDocs(tasksCollectionRef);
    const filteredData = data.docs
      .filter((doc) => doc.id !== "trash")
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    setTasks(filteredData);
  };

  useEffect(() => {
    getTasksGroup();
  }, [tasksGroup]);

  useEffect(() => {
    getTasks();
  }, [tasks]);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <>
      <Header
        header={header}
        setHeader={setHeader}
        setBackHeader={setBackHeader}
        backHeader={backHeader}
        setBlockIndex={setBlockIndex}
        blockIndex={blockIndex}
      />
      {header === "Task Notes" ? (
        <>
          <TaskGroupForm
            getTasksGroup={getTasksGroup}
            tasksCollectionRef={tasksGroupCollectionRef}
          />
          <TaskGroupList
            tasks={tasksGroup}
            setTasks={setTasksGroup}
            setHeader={setHeader}
            setBackHeader={setBackHeader}
            setIdClicked={setIdClicked}
          />
        </>
      ) : header === "Task groups shared with you" ? (
        <SharedGroupList
          setHeader={setHeader}
          setBackHeader={setBackHeader}
          setIdClicked={setIdClicked}
          header={header}
          share={"shared-with-you"}
          setSubCollection={setSubCollection}
          subCollection={subCollection}
        />
      ) : header === "Task groups you shared" ? (
        <SharedGroupList
          setHeader={setHeader}
          setBackHeader={setBackHeader}
          setIdClicked={setIdClicked}
          header={header}
          share={"shared-from-you"}
          setSubCollection={setSubCollection}
          subCollection={subCollection}
        />
      ) : header === "Trash" ? (
        <>
          <TrashGroupList
            setHeader={setHeader}
            setBackHeader={setBackHeader}
            setIdClicked={setIdClicked}
            header={header}
            share={share}
            setSubCollection={setSubCollection}
            subCollection={subCollection}
          />
        </>
      ) : header === "Trash of groups shared with you" ? (
        <TrashSharedGL
          setHeader={setHeader}
          setBackHeader={setBackHeader}
          setIdClicked={setIdClicked}
          header={header}
          share={share}
          setSubCollection={setSubCollection}
          subCollection={subCollection}
          collId="shared-with-you"
        />
      ) : header === "Trash of groups you shared" ? (
        <>
          <TrashSharedGL
            setHeader={setHeader}
            setBackHeader={setBackHeader}
            setIdClicked={setIdClicked}
            header={header}
            share={share}
            setSubCollection={setSubCollection}
            subCollection={subCollection}
            collId="shared-from-you"
          />
        </>
      ) : backHeader === "Task Notes" ? (
        <>
          <TaskForm
            getTasks={getTasks}
            tasksCollectionRef={tasksCollectionRef}
          />
          <TaskList
            title={header}
            backHeader={backHeader}
            tasksCollectionRef={tasksCollectionRef}
            groupId={idClicked}
            tasks={filteredTasks}
            setTasks={setTasks}
          />
        </>
      ) : header === "Trash of tasks" ? (
        <TasksTrashList
          setHeader={setHeader}
          setBackHeader={setBackHeader}
          setIdClicked={setIdClicked}
          setSubCollection={setSubCollection}
          subCollection={subCollection}
          backHeader={backHeader}
          groupId={idClicked}
        />
      ) : (
        <SharedList
          backHeader={backHeader}
          tasksCollectionRef={tasksCollectionRef}
          tasks={filteredTasks}
          setTasks={setTasks}
        />
      )}
      <Footer
        getTasks={getTasks}
        count={filteredTasks.length}
        filter={filter}
        setFilter={setFilter}
        setIsAuthenticated={setIsAuthenticated}
        header={header}
        setHeader={setHeader}
        setShare={setShare}
        setBackHeader={setBackHeader}
        setBlockIndex={setBlockIndex}
        backHeader={backHeader}
      />
    </>
  );
};

export default MainApp;
