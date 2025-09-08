import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import { auth, db } from "./config/fireBase";
import { getDocs, doc, collection } from "firebase/firestore";
import TaskGroupForm from "./components/TaskGroupForm";
import TaskGroupList from "./components/TaskGroupList";

interface Props {
  setIsAuthenticated: (isAuth: boolean) => void;
}

const MainApp = ({ setIsAuthenticated }: Props) => {
  const [header, setHeader] = useState("My To-Do List");
  const [tasksGroup, setTasksGroup] = useState<any[]>([]);
  const [idClicked, setIdClicked] = useState(`${tasksGroup[0]?.id}`);
  const [tasks, setTasks] = useState<any[]>([]);
  const [clicked, setClicked] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const tasksGroupCollectionRef = collection(db, `${auth?.currentUser?.email}`);

  const getTasksGroup = async () => {
    const data = await getDocs(tasksGroupCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTasksGroup(filteredData);
  };

  const tasksCollectionRef = collection(
    doc(db, `${auth?.currentUser?.email}`, `${idClicked}`),
    `${header}`
  );

  const getTasks = async () => {
    const data = await getDocs(tasksCollectionRef);
    const filteredData = data.docs.map((doc) => ({
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
      <Header header={header} setClicked={setClicked} setHeader={setHeader} />
      {clicked ? (
        <>
          <TaskGroupForm
            getTasks={getTasksGroup}
            tasksCollectionRef={tasksGroupCollectionRef}
          />
          <TaskGroupList
            tasks={tasksGroup}
            setTasks={setTasksGroup}
            setClicked={setClicked}
            setHeader={setHeader}
            setIdClicked={setIdClicked}
          />
        </>
      ) : (
        <>
          <TaskForm
            getTasks={getTasks}
            tasksCollectionRef={tasksCollectionRef}
          />
          <TaskList
            title={header}
            groupId={idClicked}
            tasks={filteredTasks}
            setTasks={setTasks}
          />
        </>
      )}
      <Footer
        getTasks={getTasks}
        count={filteredTasks.length}
        filter={filter}
        setFilter={setFilter}
        setIsAuthenticated={setIsAuthenticated}
        header={header}
      />
    </>
  );
};

export default MainApp;
