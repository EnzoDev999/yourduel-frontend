import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { error, status, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    const userData = { username, password };
    if (email) {
      userData.email = email;
    }
    dispatch(registerUser(userData));
  };

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
          Créer un compte
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Rejoignez-nous et commencez à jouer dès aujourd'hui !
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
              htmlFor="email"
            >
              Entrez votre email (optionnel)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Votre email"
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

          <div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="confirmPassword"
            >
              Confirmez votre mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Confirmez votre mot de passe"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition duration-300"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          En vous inscrivant, vous acceptez nos{" "}
          <a href="/terms" className="text-purple-600 hover:underline">
            conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="/privacy" className="text-purple-600 hover:underline">
            politique de confidentialité
          </a>
          .
        </p>

        <p className="text-center text-gray-600 mt-4">
          Vous avez déjà un compte ?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Connectez-vous
          </a>
        </p>

        {status === "loading" && (
          <p className="text-center text-gray-500 mt-4">
            Inscription en cours...
          </p>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
