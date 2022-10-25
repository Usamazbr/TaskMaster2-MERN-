// import { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";

const TaskShow = ({ task }) => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();

  const apiUrl = `http://localhost:5003`;

  const deleteClick = async () => {
    if (!user) {
      return;
    }
    const response = await fetch(apiUrl + "/api/tasks/" + task._id, {
      method: "DELETE",
      headers: { authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_TASK", payload: json });
    }
  };

  const completeClick = async () => {
    if (!user) {
      return;
    }
    let response = await fetch(
      apiUrl + "/api/tasks/" + task._id + "/completed",
      {
        method: "PATCH",
        headers: { authorization: `Bearer ${user.token}` },
      }
    );
    let json = await response.json();
    if (!response.ok) {
      console.log(json.error);
    }

    response = await fetch(apiUrl + "/api/tasks", {
      headers: { authorization: `Bearer ${user.token}` },
    });
    json = await response.json();
    if (response.ok) {
      dispatch({ type: "SET_TASKS", payload: json });
    }
  };

  const members = task.team.split(" ");

  return (
    <div className="task-details">
      <h4>{task.title}</h4>
      <p>Priority {task.prior}</p>
      <p>
        <strong>Details: </strong>
        {task.details}
      </p>
      <div>
        <strong>Team: </strong>
        {members.map((member, index) => (
          <p key={index}>
            {member}
            <br />
          </p>
        ))}
      </div>
      <p>
        <strong>Status: </strong>
        {task.ongoing ? <>Ongoing</> : <>Completed</>}
      </p>
      <p>{task.createdAt}</p>
      <button onClick={completeClick}>
        {task.ongoing ? <>Done?</> : <>Reassign?</>}
      </button>
      <button onClick={deleteClick}>delete</button>
    </div>
  );
};

export default TaskShow;
