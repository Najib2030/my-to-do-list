import { useState } from "react";
import { addDoc } from "firebase/firestore";
import { auth } from "../config/fireBase";

interface Props {
  setTasks: (tasks: any[]) => void;
  getTasks: () => void;
  tasksCollectionRef: any;
}

function TaskForm({ setTasks, getTasks, tasksCollectionRef }: Props) {
  const [task, setTask] = useState("");

  const addTask = async (task: string) => {
    await addDoc(tasksCollectionRef, {
      id: Date.now(),
      text: task,
      completed: false,
      uid: auth.currentUser?.uid,
    });

    getTasks();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      addTask(task);
      setTask("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
