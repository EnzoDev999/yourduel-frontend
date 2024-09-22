import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import { useDispatch } from "react-redux";
import { fetchUserFromToken } from "./redux/slices/userSlice";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserFromToken(token));
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {" "}
        {/* Permet d'assurer que le footer se place en bas */}
        <main className="flex-grow">
          {" "}
          {/* Cette section va occuper l'espace restant avant le footer */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Ajoute d'autres routes ici */}
          </Routes>
        </main>
        <Footer /> {/* Ajoute ton footer ici */}
      </div>
    </Router>
  );
}

export default App;
