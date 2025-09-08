interface Props {
  header: string;
  setClicked: (clicked: boolean) => void;
  setHeader: (header: string) => void;
}

function Header({ header, setClicked, setHeader }: Props) {
  return (
    <nav className="navbar bg-primary mb-4 rounded">
      <div className="container-fluid">
        {header === "My To-Do List" ? (
          ""
        ) : (
          <button
            className="btn position-absolute"
            style={{
              color: "rgba(6, 36, 137, 1)",
              fontWeight: "bold",
              backgroundColor: "#ab0fdaff",
              border: "2px solid pink",

            }}
            onClick={() => {
              setClicked(true), setHeader("My To-Do List");
            }}
          >
            &lt;- Return
          </button>
        )}
        <span className="navbar-brand mb-0 mx-auto h1 text-white">
          {header === "My To-Do List" ? (
            <span className="d-inline-block align-text-top">
              <img src="/logo.png" alt="me" width="30" height="30" />
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
