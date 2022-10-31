import { useState, useEffect } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";

const apiUrl = `http://localhost:5003`;

const MemSelect = (props) => {
  const [assigne, setAssigne] = useState([]);
  const [members, setMembers] = useState([]);
  const temp = props.mems.data;

  useEffect(() => {
    setAssigne(props.mems.data);
  }, []);
  useEffect(() => {
    props.selectMems(members);
  }, [members]);

  const proTasker = async (e) => {
    const val = e.target.value;
    const ob = temp.filter((f) => f.email === val);
    setMembers((m) => {
      return [...m, ob[0]];
    });
    setAssigne((a) => {
      return a.filter((f) => f.email !== val);
    });
    var dropDown = document.getElementById("members");
    dropDown.selectedIndex = 0;
  };

  return (
    <div>
      <select id="members" name="mems" onChange={proTasker}>
        <option>select</option>
        <optgroup label="Juniors">
          {assigne.map((member, index) => (
            <option key={index}>{member.email}</option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};

const SenSelect = (props) => {
  const [assigne, setAssigne] = useState([]);
  const [member, setMember] = useState("");
  const temp = props.mems.data;

  useEffect(() => {
    setAssigne(props.mems.data);
  }, []);
  useEffect(() => {
    props.selectMems(member);
  }, [member]);

  const proTasker = async (e) => {
    const val = e.target.value;
    const ob = temp.filter((f) => f.email === val);
    setMember(ob[[0]]);
  };

  return (
    <div>
      <select id="member" name="mems" onChange={proTasker}>
        <option>select</option>
        <optgroup label="Seniors">
          {assigne.map((member, index) => (
            <option key={index}>{member.email}</option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};

const TaskForm = () => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const mems = JSON.parse(localStorage.getItem("juniors"));
  const mems2 = JSON.parse(localStorage.getItem("seniors"));

  const [selected, setSelected] = useState([]);
  const [selected2, setSelected2] = useState("");
  const [approved, setApproved] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [team, setTeam] = useState("");
  const [prior, setPrior] = useState("");
  const [completed, setCompleted] = useState(false);
  const [protask, setProtask] = useState(false);
  const [ongoing, setOngoing] = useState(true);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  useEffect(() => {
    setSelected([]);
    if (user.admin) {
      setApproved(true);
    }
  }, []);

  const togglestate = () => {
    var toggleBox = document.getElementById("myCheck");
    console.log(approved);
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
    if (!selected) {
      setError("Assignees must be selected");
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
      selected,
      approved,
      selected2,
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
    // console.log(json);
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
      setSelected([]);
      setSelected2("");
      setApproved(false);
    }
    if (response.ok) {
      setEmptyFields([]);
      setError(null);
      setTitle("");
      setDetails("");
      setTeam("");
      setPrior("");
      dispatch({ type: "CREATE_TASK", payload: json });
      setSelected2("");
      setSelected([]);
      setApproved(false);
    }
    setSelected([]);
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Task</h3>

      <label>
        Task Title:
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className={emptyFields.includes("title") ? "error" : ""}
        />
      </label>

      <label>
        Details:(not required)
        <input
          type="text"
          onChange={(e) => setDetails(e.target.value)}
          value={details}
        />
      </label>

      <label>
        Team Members:
        <input
          type="text"
          onChange={(e) => setTeam(e.target.value)}
          value={team}
          className={emptyFields.includes("team") ? "error" : ""}
        />
      </label>

      {selected &&
        selected.map((member, index) => <p key={index}>{member.email}</p>)}

      <label>Assignees:</label>
      <MemSelect mems={mems} selectMems={(e) => setSelected(e)} />

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
      {protask && !user.admin && (
        <label>
          Request senior:
          <SenSelect mems={mems2} selectMems={(e) => setSelected2(e)} />
        </label>
      )}

      <button>Add Task</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default TaskForm;
