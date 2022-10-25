import { useAuthContext } from "./useAuthContext";
import { useTasksContext } from "./useTasksContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: tasksDispatch } = useTasksContext();

  const logout = () => {
    localStorage.removeItem("user");

    // logout
    dispatch({ type: "LOGOUT" });
    tasksDispatch({ type: "SET_TASKS", payload: null });
  };

  return { logout };
};
