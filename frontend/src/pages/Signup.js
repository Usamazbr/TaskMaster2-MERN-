import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [approve, setApprove] = useState(false);
  const { signup, err, loadState } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApprove(false);
    await signup(email, password, admin, approve);
  };
  const toggle = () => {
    var toggleBox = document.getElementById("adminCheck");
    if (toggleBox.checked === true) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <label>Email address:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <label className="switch">
        Are you making an admin account?
        <input type="checkbox" id="adminCheck" onClick={toggle} />
      </label>
      <label>{!admin && <input />}</label>

      <button disabled={loadState}>Sign up</button>
      {err && <div className="error">{err}</div>}
    </form>
  );
};

export default Signup;
