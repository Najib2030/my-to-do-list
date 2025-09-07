function Header() {
  return (
    <nav className="navbar bg-primary mb-4 rounded">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 mx-auto h1 text-white">
          <span className="d-inline-block align-text-top">
            <img src="../public/logo.png" alt="Logo" width="30" height="30" />
          </span> My To-Do List
        </span>
      </div>
    </nav>
  );
}

export default Header;
