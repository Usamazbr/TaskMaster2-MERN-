import { useEffect } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

import TaskShow from "../components/TaskShow";
import TaskForm from "../components/TaskForm";
import HierS from "../components/HierS";

const HomeP = () => {
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const { logout } = useLogout();

  useEffect(() => {
    const apiUrl = `http://localhost:5003`;
    const taskFetch = async () => {
      const response = await fetch(apiUrl + "/api/tasks", {
        headers: { authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_TASKS", payload: json });
      }
    };
    if (user) {
      taskFetch();
    }
    setTimeout(() => {
      logout();
    }, 60000);
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className="tasks">
        {tasks &&
          tasks.map((task) =>
            task.protask ? (
              task.approved && (
                <div className="pro-task" key={task._id}>
                  <TaskShow task={task} />
                </div>
              )
            ) : (
              <div className="normal-task" key={task._id}>
                <TaskShow className="normal-task" task={task} />
              </div>
            )
          )}
      </div>
      <div>
        {user.approve ? (
          <TaskForm />
        ) : (
          <div>
            <h4>Approve First</h4>
            {!user.path && <HierS />}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeP;
