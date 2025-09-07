import SignOut from "./SignOut";

interface Props {
  count: number;
  filter: "all" | "active" | "completed";
  setFilter: (filter: "all" | "active" | "completed") => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  getTasks: () => void;
}

function Footer({ count, filter, setFilter, setIsAuthenticated, getTasks }: Props) {
  return (
    <div className="bg-light border-top py-2 fixed-bottom px-2">
      <div className="d-flex justify-content-between align-items-center">
        {count === 1 ? (
          filter === "completed" ? (
            <span>{count} task completed</span>
          ) : filter === "all" ? (
            <span>{count} task</span>
          ) : (
            <span>{count} task left</span>
          )
        ) : filter === "completed" ? (
          <span>{count} tasks completed</span>
        ) : filter === "all" ? (
          <span>{count} tasks</span>
        ) : (
          <span>{count} tasks left</span>
        )}
        <div className="btn-group">
          <button
            className={`btn btn-sm ${
              filter === "all" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => {setFilter("all"); getTasks();}}
          >
            All
          </button>
          <button
            className={`btn btn-sm ${
              filter === "active" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => {setFilter("active"); getTasks();}}
          >
            Active
          </button>
          <button
            className={`btn btn-sm ${
              filter === "completed" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => {setFilter("completed"); getTasks();}}
          >
            Completed
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span className="small">© 2025 My React App</span>
        <SignOut setIsAuthenticated={setIsAuthenticated} />
      </div>
    </div>
  );
}

export default Footer;
