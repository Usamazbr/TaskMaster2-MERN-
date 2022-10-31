import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomeP from "./pages/HomeP";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// Components
import Navbar2 from "./components/Navbar2";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user } = useAuthContext();
  // console.log(user.admin);
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar2 />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <HomeP /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
