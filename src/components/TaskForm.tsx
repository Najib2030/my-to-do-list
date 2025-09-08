import { useState } from "react";
import { addDoc } from "firebase/firestore";
import { auth } from "../config/fireBase";

interface Props {
  getTasks: () => void;
  tasksCollectionRef: any;
}

function TaskForm({ getTasks, tasksCollectionRef }: Props) {
  const [task, setTask] = useState("");

  const addTask = async (task: string) => {
    await addDoc(tasksCollectionRef, {
      task: task,
      completed: false,
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
    <form onSubmit={handleSubmit} className="mb-3 mx-2">
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
