import { useState } from "react";
import { addDoc } from "firebase/firestore";

interface Props {
  getTasks: () => void;
  tasksCollectionRef: any;
}

function TaskGroupForm({ getTasks, tasksCollectionRef }: Props) {
  const [taskGroupTitle, setTaskGroupTitle] = useState("");

  const addTaskGroup = async (task: string) => {
    await addDoc(tasksCollectionRef, {
      text: task,
    });

    getTasks();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskGroupTitle.trim()) {
      addTaskGroup(taskGroupTitle);
      setTaskGroupTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3 mx-2">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new tasks title..."
          value={taskGroupTitle}
          onChange={(e) => setTaskGroupTitle(e.target.value)}
        />
        <button className="btn" type="submit" style={{backgroundColor: "#ab0fda"}}>
          Add
        </button>
      </div>
    </form>
  );
}

export default TaskGroupForm;
