import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const apiUrl = `http://localhost:5003/api/user/login`;
const apiUrl2 = `http://localhost:5003/api/user/data`;

export const useLogin = () => {
  const [err, setErr] = useState(null);
  const [loadState, setLoadState] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setLoadState(true);
    setErr(null);

    let response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    response = await fetch(apiUrl2, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json2 = await response.json();
    if (!response.ok) {
      console.log(json.err);
      console.log(json2.err);
      setLoadState(false);
      setErr(json.err);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      localStorage.setItem("users", JSON.stringify(json2));

      dispatch({ type: "LOGIN", payload: [json, json2] });
      setLoadState(false);
    }
  };

  return { login, loadState, err };
};
