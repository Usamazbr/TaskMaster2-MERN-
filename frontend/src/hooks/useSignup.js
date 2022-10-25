import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const apiUrl = `http://localhost:5003/api/user/signup`;

export const useSignup = () => {
  // const [admin1, setAdmin1] = useState(false);
  const [err, setErr] = useState(null);
  const [loadState, setLoadState] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, admin) => {
    setLoadState(true);
    setErr(null);
    // console.log(admin);
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, admin }),
    });
    // .catch((error) => {
    //   console.log(error);
    // });
    const json = await response.json();
    console.log(json);

    if (!response.ok) {
      console.log(json);
      setLoadState(false);
      setErr(json.err);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));

      dispatch({ type: "LOGIN", payload: json });

      setLoadState(false);
    }
  };

  return { signup, loadState, err };
};
