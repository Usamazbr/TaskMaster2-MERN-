import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const apiUrl = `http://localhost:5003/api/user/login`;
const apiUrl2 = `http://localhost:5003/api/user/data`;
const apiUrl3 = `http://localhost:5003/api/user/data/juniors/`;
const apiUrl4 = `http://localhost:5003/api/user/data/seniors/`;

export const useLogin = () => {
  const [err, setErr] = useState(null);
  const [loadState, setLoadState] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setLoadState(true);
    setErr(null);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();

    const response2 = await fetch(apiUrl3 + email, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json2 = await response2.json();

    const response4 = await fetch(apiUrl4 + email, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json4 = await response4.json();

    const response3 = await fetch(apiUrl2, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const json3 = await response3.json();

    if (!response.ok) {
      console.log(json.err);
      console.log(json2.err);
      setLoadState(false);
      setErr(json.err);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      localStorage.setItem("juniors", JSON.stringify(json2));
      localStorage.setItem("seniors", JSON.stringify(json4));
      localStorage.setItem("users", JSON.stringify(json3));
      const startTime = new Date().getTime();
      localStorage.setItem("time", JSON.stringify(startTime));

      dispatch({ type: "LOGIN", payload: json });
      setLoadState(false);
    }
  };

  return { login, loadState, err };
};
