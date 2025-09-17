import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

interface Props {
  task: { id: string; task: string; completed: boolean; description: string };
  setTasks: (tasks: any[]) => void;
  tasksCollectionRef: any;
  backHeader: string;
  tasks: any[];
}

function Textarea({
  task,
  tasks,
  setTasks,
  backHeader,
  tasksCollectionRef,
}: Props) {
  const [updatedDescription, setUpdatedDescription] = useState(
    task.description
  );
  const [descriptionEdit, setDescriptionEdit] = useState(
    updatedDescription === "" ? true : false
  );

  const handleDescriptionEdit = async () => {
    if (updatedDescription.trim()) {
      setDescriptionEdit(false);
    }
    await onDescriptionEdit(task.id, updatedDescription);
  };

  const onDescriptionEdit = async (id: string, updatedDescription: string) => {
    const taskDoc = doc(tasksCollectionRef, id);
    await updateDoc(taskDoc, { description: updatedDescription });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, description: updatedDescription } : task
      )
    );
  };

  return (
    <div className="mx-1" style={{ position: "relative" }}>
      {descriptionEdit ? (
        <>
          <textarea
            rows={3}
            id={`textarea-${task.id}`}
            style={{
              border: "1px solid",
              borderRadius: "5px",
              backgroundColor: "#645f5fff",
              color: "#fff",
              width: "-webkit-fill-available",
            }}
            value={updatedDescription}
            onBlur={(e) => {
              setUpdatedDescription(e.target.value);
              handleDescriptionEdit();
            }}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            autoFocus
          >
            {task.description}
          </textarea>
          <button
            className="btn btn-sm btn-success"
            style={{
              position: "absolute",
              right: 8,
              bottom: 15,
            }}
            onClick={() => handleDescriptionEdit()}
          >
            done
          </button>
        </>
      ) : (
        <>
          <textarea
            rows={3}
            readOnly
            id={`textarea-${task.id}`}
            style={{
              border: "1px solid",
              borderRadius: "5px",
              backgroundColor: "#645f5fff",
              color: "#fff",
              width: "-webkit-fill-available",
            }}
            title="description"
            value={updatedDescription}
          >
            {task.description}
          </textarea>
          {backHeader === "Task Notes" && (
            <button
              className="btn btn-sm btn-primary"
              style={{
                position: "absolute",
                right: 8,
                bottom: 15,
              }}
              onClick={() => setDescriptionEdit(true)}
            >
              edit
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Textarea;
