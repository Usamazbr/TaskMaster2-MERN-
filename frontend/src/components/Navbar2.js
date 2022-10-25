import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar2 = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  // console.log(user);
  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Taskmaster</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.email}</span>
              <span>{user.admin ? <> (Admin) </> : <> (User) </>}</span>
              {/* <button onClick={""}>bell</button> */}
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar2;
