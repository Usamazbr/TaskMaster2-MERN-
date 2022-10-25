import { TasksContext } from "../context/TasksContext";
import { useContext } from "react";

export const useTasksContext = () => {
  const context = useContext(TasksContext);

  if (!context) {
    throw Error("Tasks Context must be used inside a TasksContextProvider tag");
  }

  return context;
};
