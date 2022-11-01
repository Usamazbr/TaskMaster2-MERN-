import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const apiUrl = `http://localhost:5003/api/user`;
const apiUrl2 = `http://localhost:5003/api/tasks`;

const Notifications = (props) => {
  const [nots, setNots] = useState("");
  const [mss, setMss] = useState("");
  useEffect(() => {
    const notFetch = async () => {
      const response = await fetch(apiUrl + "/Nots/" + props.email, {
        headers: { "Content-Type": "application/json" },
      });
      setNots(await response.json());
    };
    if (props.email) {
      notFetch();
    }

    setTimeout(() => setMss(""), 3000);
  }, [props.email, mss]);

  const approveA = async (e) => {
    const choice = e.target.value;
    if (choice !== "Notifications") {
      // approving and deleting notification
      const ob = nots.filter((f) => f.authapp === choice);

      const response = await fetch(apiUrl + "/Nots/" + ob[0]._id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const json = await response.json();
      console.log(json);
      setNots((a) => {
        return a.filter((f) => f.authapp !== choice);
      });
    }
    setMss("User Approved !");
    var dropDown = document.getElementById("Accountnotifications");
    dropDown.selectedIndex = 0;
  };

  const approveB = async (e) => {
    const choice = e.target.value;

    const ob2 = nots.filter((f) => f.taskapp === choice);
    console.log(ob2[0]._id);
    const response = await fetch(apiUrl2 + "/Nots/" + ob2[0]._id, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${props.user.token}`,
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);

    setNots((a) => {
      return a.filter((f) => f.taskapp !== choice);
    });
    setMss("Task Approved !");
    var dropDown = document.getElementById("Tasksnotifications");
    dropDown.selectedIndex = 0;
  };

  return (
    <div>
      <select id="Accountnotifications" name="nots" onChange={approveA}>
        <option>Notifications</option>
        <optgroup label="Accounts">
          {nots &&
            nots.map((not, index) => (
              <option key={index}>{not.authapp}</option>
            ))}
        </optgroup>
      </select>
      <select id="Tasksnotifications" name="nots" onChange={approveB}>
        <option>Notifications</option>
        <optgroup label="Tasks">
          {nots &&
            nots.map((not, index) => (
              <option key={index}>{not.taskapp}</option>
            ))}
        </optgroup>
      </select>
      <h4>{mss && mss}</h4>
    </div>
  );
};

const Navbar2 = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  // const [hier, setHier] = useState(false);

  const handleClick = () => {
    logout();
  };

  // const hClick = () => {
  // setHier;
  // };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Taskmaster</h1>
        </Link>
        <nav>
          {user && (
            <div>
              {/* <button onClick={hClick}>Hierarchy</button> */}
              <span>
                <Notifications email={user.email} user={user} />
              </span>
              <span>
                {user.approve ? <> (approved) </> : <> (Not approved) </>}
              </span>
              <span>{user.email}</span>
              <span>{user.admin ? <> (Admin) </> : <> (User) </>}</span>
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
