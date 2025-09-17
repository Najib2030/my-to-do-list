interface Props {
  task: { id: string; task: string; completed: boolean; description: string };
}

function TrashTextarea({
  task,
}: Props) {

  return (
    <div className="mx-1" style={{ position: "relative" }}>
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
          >
            {task.description}
          </textarea>
        </>
    </div>
  );
}

export default TrashTextarea;
