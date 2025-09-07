import TaskItem from "./TaskItem";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../config/fireBase";

interface Props {
  tasks: any[];
  setTasks: (tasks: any[]) => void;
}

function TaskList({ tasks, setTasks }: Props) {

  const onToggle = async (id: string, completed: boolean) => {
    const taskDoc = doc(db, `${auth?.currentUser?.email}`, id);
    await updateDoc(taskDoc, { completed: completed });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const onDelete = async (id: string) => {
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
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          setTasks={setTasks}
          tasks={tasks}
        />
      ))}
    </ul>
  );
}

export default TaskList;
