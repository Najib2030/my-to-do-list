import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import SharedItem from "./SharedItem";

interface Props {
  setTasks: (tasks: any[]) => void;
  tasksCollectionRef: any;
  backHeader: string;
  tasks: any[];
}

function SharedList({
  tasks,
  setTasks,
  backHeader,
  tasksCollectionRef,
}: Props) {
  const onToggle = async (id: string, completed: boolean) => {
    const taskDoc = doc(tasksCollectionRef, id);
    await updateDoc(taskDoc, { completed: completed });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const onDelete = async (id: string) => {
    const taskDoc = doc(tasksCollectionRef, id);
    await deleteDoc(taskDoc);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  if (tasks.length === 0) {
    return (
      <div className="alert alert-info text-center">
        There is no tasks in this group.
      </div>
    );
  }

  return (
    <ul className="list-group" style={{ paddingBottom: "105px" }}>
      {tasks.map((task) => (
        <SharedItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          setTasks={setTasks}
          tasks={tasks}
          backHeader={backHeader}
          tasksCollectionRef={tasksCollectionRef}
        />
      ))}
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
    </ul>
  );
}

export default SharedList;
