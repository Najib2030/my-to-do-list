interface Props {
  setBackHeader: (backHeader: string) => void;
  setBlockIndex: (blockIndex: string) => void;
  setHeader: (header: string) => void;
  backHeader: string;
  blockIndex: string;
  header: string;
}

function Header({
  header,
  setHeader,
  backHeader,
  blockIndex,
  setBackHeader,
  setBlockIndex,
}: Props) {
  const back = () => {
    if (backHeader !== "Trash" && backHeader !== "Task Notes") {
      setHeader(backHeader);
      setBackHeader("Task Notes");
    } else if (blockIndex === "block2") {
      setHeader(backHeader);
      setBackHeader("Task Notes");
    } else if (blockIndex === "block3w") {
      setHeader("Task groups shared with you");
      setBlockIndex("block2");
    } else if (blockIndex === "block3f") {
      setHeader("Task groups you shared");
      setBlockIndex("block2");
    }
  };
  const cc = "#0d6efd";
  return (
    <nav
      className="navbar mb-4"
      style={{
        backgroundColor: header === "Task Notes" ? "#ab0fda" : "#0d6efd",
        borderRadius: "0 0 6px 6px",
      }}
    >
      <div className="container-fluid" style={{ flexWrap: "nowrap" }}>
        {header === "Task Notes" ? (
          ""
        ) : (
          <button
            className="btn"
            style={{
              color: "rgba(6, 36, 137, 1)",
              fontWeight: "bold",
              backgroundColor: "#ab0fdaff",
              border: "2px solid pink",
              minWidth: "fit-content",
            }}
            onClick={() => {
              back();
            }}
          >
            &lt;- Return
          </button>
        )}
        <span
          className="navbar-brand mb-0 mx-auto h1 text-white"
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            textAlign: "center",
          }}
        >
          {header === "Task Notes" ? (
            <span className="">
              <img src="/logo.png" alt="me" width="70" height="70" />
            </span>
          ) : (
            ""
          )}
          {header}
        </span>
      </div>
    </nav>
  );
}

export default Header;
