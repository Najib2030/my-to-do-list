import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import { auth, db } from "./config/fireBase";
import { getDocs, collection } from "firebase/firestore";

interface Props {
  setIsAuthenticated: (isAuth: boolean) => void;
}

const MainApp = ({ setIsAuthenticated }: Props) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const tasksCollectionRef = collection(db, `${auth?.currentUser?.email}`);

  const getTasks = async () => {
    const data = await getDocs(tasksCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTasks(filteredData);
  };

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
      <Header />
      <TaskForm
        setTasks={setTasks}
        getTasks={getTasks}
        tasksCollectionRef={tasksCollectionRef}
      />
      <TaskList tasks={filteredTasks} setTasks={setTasks} />
      <Footer
        getTasks={getTasks}
        count={filteredTasks.length}
        filter={filter}
        setFilter={setFilter}
        setIsAuthenticated={setIsAuthenticated}
      />
    </>
  );
};

export default MainApp;
