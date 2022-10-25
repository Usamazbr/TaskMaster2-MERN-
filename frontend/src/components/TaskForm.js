import { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";

const apiUrl = `http://localhost:5003`;

const TaskForm = () => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const mems = JSON.parse(localStorage.getItem("users"));
  console.log(mems.data[0]._id);
  // const { dispatch } = useAuthContext();
  //wtf

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [team, setTeam] = useState("");
  const [prior, setPrior] = useState("");
  const [completed, setCompleted] = useState(false);
  const [protask, setProtask] = useState(false);
  const [ongoing, setOngoing] = useState(true);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const togglestate = () => {
    var toggleBox = document.getElementById("myCheck");

    if (toggleBox.checked === true) {
      setOngoing(false);
      setCompleted(true);
    } else {
      setOngoing(true);
      setCompleted(false);
    }
  };
  const protoggle = () => {
    var toggleBox = document.getElementById("myCheck2");

    if (toggleBox.checked === true) {
      setProtask(true);
    } else {
      setProtask(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You're not logged in");
      return;
    }

    const task = {
      title,
      details,
      team,
      prior,
      ongoing,
      completed,
      protask,
    };

    const response = await fetch(apiUrl + "/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setEmptyFields([]);
      setError(null);
      setTitle("");
      setDetails("");
      setTeam("");
      setPrior("");
      dispatch({ type: "CREATE_TASK", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Task</h3>

      <label>Task Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <label>Details:(not required)</label>
      <input
        type="text"
        onChange={(e) => setDetails(e.target.value)}
        value={details}
      />

      <label>Team Members:</label>
      <input
        type="text"
        onChange={(e) => setTeam(e.target.value)}
        value={team}
        className={emptyFields.includes("team") ? "error" : ""}
      />

      {/* <label>Assignees:</label>
      <select id="members" name="mems">
        {mems.data.map((member, index) => (
          <option key={index}>
            {member}
            <br />
          </option>
        ))}
      </select> */}

      <label>
        Priority:
        <input
          type="number"
          onChange={(e) => setPrior(e.target.value)}
          value={prior}
          className={emptyFields.includes("prior") ? "error" : ""}
        />
      </label>

      <label className="switch">
        Check if you're adding a completed task
        <input type="checkbox" id="myCheck" onClick={togglestate} />
      </label>

      <label className="switch">
        Is this a proTask?
        <br />
        {user.admin ? <> Assign Task</> : <>Request task</>}
        <input type="checkbox" id="myCheck2" onClick={protoggle} />
      </label>

      <button>Add Task</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default TaskForm;
