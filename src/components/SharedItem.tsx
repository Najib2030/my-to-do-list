import Textarea from "./Textarea";
import { useState } from "react";

interface Props {
  task: { id: string; task: string; completed: boolean; description: string };
  onToggle: (id: string, completed: boolean) => void;
  setTasks: (tasks: any[]) => void;
  onDelete: (id: string) => void;
  tasksCollectionRef: any;
  backHeader: string;
  tasks: any[];
}

function SharedItem({
  task,
  tasks,
  onToggle,
  onDelete,
  setTasks,
  backHeader,
  tasksCollectionRef,
}: Props) {
  const [description, setDescription] = useState(false);

  return (
    <>
      <li
        className="list-group-item d-flex align-item-center justify-content-between mx-1 mt-2"
        style={{
          cursor: "pointer",
          border: "1px solid",
          borderRadius: "5px",
          padding: "0",
          backgroundColor: task.completed ? "#80fe72a8" : "",
        }}
      >
        <>
          <div
            className="align-items-center d-flex"
            style={{ width: "-webkit-fill-available" }}
          >
            <label
              style={{
                width: "-webkit-fill-available",
                cursor: "pointer",
                margin: "11px 39px",
              }}
              onClick={() => setDescription(!description)}
            >
              {task.task}
            </label>
          </div>
        </>
      </li>
      {description ? (
        <Textarea
          backHeader={backHeader}
          task={task}
          setTasks={setTasks}
          tasks={tasks}
          tasksCollectionRef={tasksCollectionRef}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default SharedItem;
