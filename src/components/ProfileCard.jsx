import React, { useState, useEffect } from "react";
import TrophyIcon from "../assets/icon/trophy-icon.svg"; // Import de l'icône trophée
import GamesIcon from "../assets/icon/Games-icon.svg"; // Import d'une autre icône
import RankIcon from "../assets/icon/medal-icon.svg"; // Import de l'icône de classement
import EditIcon from "../assets/icon/edit-icon.svg"; // Import de l'icône d'édition
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserProfile,
  fetchUserFromToken,
} from "../redux/slices/userSlice";
import { io } from "socket.io-client"; // Import du client WebSocket

const ProfileCard = ({
  username,
  memberSince,
  gamesPlayed,
  gamesWon,
  rank,
  points,
  onUpdateUsername, // Prop pour signaler la mise à jour du username
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [error, setError] = useState(""); // Ajouter un état pour l'erreur
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // Utiliser le selector pour toujours récupérer le dernier username et points depuis l'état global
  const currentUser = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);

  // Synchroniser `newUsername` et `points` avec les valeurs du store Redux
  useEffect(() => {
    if (currentUser && currentUser.username) {
      setNewUsername(currentUser.username);
    }
  }, [currentUser]);

  // Initialisation du WebSocket pour écouter les mises à jour du leaderboard
  useEffect(() => {
    const API_URL =
      window.location.hostname === "localhost"
        ? process.env.REACT_APP_API_URL_LOCAL
        : process.env.REACT_APP_API_URL_NETWORK;
    const socket = io(API_URL);

    // Écoute de l'événement `leaderboardUpdated` via WebSocket
    socket.on("leaderboardUpdated", () => {
      console.log("Leaderboard updated - fetching new user profile");
      if (token) {
        dispatch(fetchUserFromToken(token)); // Récupérer le profil mis à jour en cas de mise à jour du leaderboard
      }
    });

    return () => {
      socket.disconnect(); // Fermer la connexion au WebSocket lors du démontage
    };
  }, [dispatch, token]);

  const handleUsernameChange = async () => {
    if (isSubmitting) return; // Empêcher l'envoi multiple
    setIsSubmitting(true);

    if (!newUsername || newUsername.trim() === "") {
      setError("Le nouveau nom d'utilisateur est obligatoire");
      setIsSubmitting(false);
      return;
    }

    try {
      // Utilisation de l'action updateUserProfile pour mettre à jour le store Redux
      const action = await dispatch(
        updateUserProfile({ newUsername })
      ).unwrap();

      if (action.newUsername) {
        setIsEditing(false);
        setError("");
        onUpdateUsername(); // Recharger le profil complet
        // Re-fetch the user profile after username change
        dispatch(fetchUserFromToken(token)); // Assurez-vous de recharger le profil à partir du backend
      }
    } catch (error) {
      // Gestion des erreurs retournées par le slice Redux
      if (error === "Le pseudo est déjà pris") {
        setError("Ce pseudo est déjà pris. Veuillez en choisir un autre.");
      } else {
        console.error("Erreur lors de la mise à jour du pseudo :", error);
        setError("Erreur lors de la mise à jour. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false); // Réactiver le bouton après la requête
    }
  };

  return (
    <div className="bg-[#F5F5F5] border border-gray-300 rounded-lg shadow-lg shadow-gray-400 p-6 w-full sm:w-[400px] h-[350px] mx-auto overflow-hidden">
      {/* Section Avatar */}
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Profile</h2>
        {/* Icône d'édition */}
        <button
          className="text-purple-600 hover:text-purple-700"
          onClick={() => setIsEditing(!isEditing)} // Activer/désactiver le mode édition
        >
          <img src={EditIcon} alt="Edit Icon" className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="relative">
          {/* Avatar */}
          <div className="w-20 h-20 bg-purple-600 text-white text-3xl flex items-center justify-center rounded-full">
            {/* Utiliser displayUsername pour éviter l'accès à undefined */}
            {newUsername ? newUsername[0].toUpperCase() : "U"}
          </div>
          {/* Petit badge */}
          <span className="absolute bottom-0.5 right-1 block w-5 h-5 bg-white rounded-full border-2 border-purple-600"></span>
        </div>

        {/* Nom d'utilisateur */}
        {isEditing ? (
          <div className="mt-4 text-center">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
            {/* Afficher le message d'erreur si le pseudo est déjà pris */}
            {error && <p className="text-red-600 mt-2">{error}</p>}
            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                onClick={handleUsernameChange}
                disabled={isSubmitting} // Désactiver le bouton lors de l'envoi
              >
                Enregistrer
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
                onClick={() => {
                  setNewUsername(username); // Réinitialiser le pseudo
                  setIsEditing(false); // Quitter le mode édition
                  setError(""); // Réinitialiser l'erreur
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="mt-4 text-xl font-semibold text-purple-700 text-center">
              {currentUser ? currentUser.username : "Utilisateur"}
            </h2>
            <p className="text-gray-500 text-sm text-center">
              Membre depuis: {memberSince}
            </p>
          </div>
        )}

        {/* Icônes avec informations */}
        <div className="mt-8 grid grid-cols-3 gap-4 w-full">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full shadow-md">
              <img src={GamesIcon} alt="Games Icon" className="w-6 h-6" />
              <p className="text-purple-700 font-semibold">{gamesPlayed}</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full shadow-md">
              <img src={TrophyIcon} alt="Trophy Icon" className="w-6 h-6" />
              <p className="text-purple-700 font-semibold">{gamesWon}</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full shadow-md">
              <img src={RankIcon} alt="Rank Icon" className="w-6 h-6" />
              <p className="text-purple-700 font-semibold">{rank}</p>
            </div>
          </div>
        </div>

        {/* Points */}
        <p className="mt-6 text-purple-700 font-semibold text-center">
          Points: {currentUser ? currentUser.points : points}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
