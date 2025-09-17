import { setDoc, doc } from "firebase/firestore";
import { useState } from "react";

interface Props {
  getTasksGroup: () => void;
  tasksCollectionRef: any;
}

function TaskGroupForm({ getTasksGroup, tasksCollectionRef }: Props) {
  const [taskGroupTitle, setTaskGroupTitle] = useState("");

  const addTaskGroup = async (task: string) => {

    const today = new Date();
    const newId = today.getTime().toString();

    await setDoc(doc(tasksCollectionRef, newId), {
      text: task,
    });

    getTasksGroup();
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
        <button
          className="btn"
          type="submit"
          style={{ backgroundColor: "#ab0fda" }}
        >
          Add
        </button>
      </div>
    </form>
  );
}

export default TaskGroupForm;
