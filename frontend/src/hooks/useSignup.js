import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const apiUrl = `http://localhost:5003/api/user/signup`;
const apiUrl2 = `http://localhost:5003/api/user/data`;
const apiUrl3 = `http://localhost:5003/api/user/data/juniors/`;

export const useSignup = () => {
  // const [admin1, setAdmin1] = useState(false);
  const [err, setErr] = useState(null);
  const [loadState, setLoadState] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, admin, approve) => {
    setLoadState(true);
    setErr(null);
    // console.log(admin);
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, admin, approve }),
    });
    const json = await response.json();

    const response2 = await fetch(apiUrl3 + email, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json2 = await response2.json();

    const response3 = await fetch(apiUrl2, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const json3 = await response3.json();

    if (!response.ok) {
      console.log(json);
      setLoadState(false);
      setErr(json.err);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      localStorage.setItem("juniors", JSON.stringify(json2));
      localStorage.setItem("users", JSON.stringify(json3));

      dispatch({ type: "LOGIN", payload: json });

      setLoadState(false);
    }
  };

  return { signup, loadState, err };
};
