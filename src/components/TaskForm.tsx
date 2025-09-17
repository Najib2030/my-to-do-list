import { setDoc, doc } from "firebase/firestore";
import { useState } from "react";

interface Props {
  tasksCollectionRef: any;
  getTasks: () => void;
}

function TaskForm({ getTasks, tasksCollectionRef }: Props) {
  const [task, setTask] = useState("");

  const addTask = async (task: string) => {
    const today = new Date();
    const newId = today.getTime().toString();

    await setDoc(doc(tasksCollectionRef, newId), {
      task: task,
      completed: false,
      description: "",
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
