import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isAuthenticated, error, status } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {/* Flèche pour revenir à la page d'accueil */}
        <div className="flex justify-start mb-4">
          <a
            href="/"
            className="flex items-center text-purple-600 hover:text-purple-700 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 mr-2 transition-transform duration-300 transform group-hover:-translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour à l'accueil
          </a>
        </div>

        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Connexion
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Ravi de vous revoir ! Entrez vos informations pour continuer.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="username"
            >
              Entrez votre pseudo
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Votre pseudo"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Entrez votre mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Votre mot de passe"
            />
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-purple-600 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition duration-300"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-purple-600 hover:underline">
            Inscrivez-vous
          </a>
        </p>

        {status === "loading" && (
          <p className="text-center text-gray-500 mt-4">Logging in...</p>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
