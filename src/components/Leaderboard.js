import React, { useEffect, useState } from "react";
import axios from "axios";
import GoldMedalIcon from "../assets/icon/goldMedal-icon.svg"; // Icône médaille d'or
import SilverMedalIcon from "../assets/icon/silverMedal-icon.svg"; // Icône médaille d'argent
import BronzeMedalIcon from "../assets/icon/bronzeMedal-icon.svg"; // Icône médaille de bronze
const { io } = require("socket.io-client");

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]); // Liste actuelle
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion d'erreur
  const [page, setPage] = useState(1); // Page actuelle
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
  const [initialLeaderboard, setInitialLeaderboard] = useState([]); // Liste des premiers utilisateurs

  const API_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_URL_LOCAL
      : process.env.REACT_APP_API_URL_NETWORK;

  useEffect(() => {
    const fetchLeaderboard = async (currentPage = 1) => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/leaderboard`, {
          params: { page: currentPage, limit: 5 }, // Limite à 5 résultats par page
        });

        if (currentPage === 1) {
          setInitialLeaderboard(response.data.users); // Sauvegarder les données initiales de la première page
          setLeaderboard(response.data.users); // Mettre à jour la liste initiale des joueurs
        } else {
          setLeaderboard((prevLeaderboard) => [
            ...prevLeaderboard,
            ...response.data.users,
          ]); // Concaténer les nouveaux utilisateurs au classement déjà chargé
        }

        setTotalPages(response.data.totalPages); // Mettre à jour le nombre total de pages
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération du classement général");
        setLoading(false);
      }
    };

    fetchLeaderboard(page);

    // Ecouter l'événement leaderboardUpdated via WebSocket
    const socket = io(API_URL);

    socket.on("leaderboardUpdated", () => {
      fetchLeaderboard(1); // Rafraîchir le classement dès qu'un duel est terminé
    });

    return () => {
      socket.off("duelCompleted");
    };
  }, [API_URL, page]);

  if (loading) {
    return <p>Chargement du classement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (leaderboard.length === 0) {
    return <p>Aucun utilisateur n'a encore marqué de points.</p>;
  }

  // Fonction pour déterminer l'icône de la position
  const getMedalIcon = (position) => {
    if (position === 1)
      return <img src={GoldMedalIcon} alt="Gold Medal" className="w-5 h-5" />;
    if (position === 2)
      return (
        <img src={SilverMedalIcon} alt="Silver Medal" className="w-5 h-5" />
      );
    if (position === 3)
      return (
        <img src={BronzeMedalIcon} alt="Bronze Medal" className="w-5 h-5" />
      );
    return <span>{position}</span>; // Si la position n'est pas dans le top 3, retourne simplement le numéro
  };

  // Fonction pour charger plus de joueurs
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1); // Augmente le numéro de page pour charger plus de joueurs
    }
  };

  // Fonction pour revenir à l'affichage initial
  const handleLoadLess = () => {
    setLeaderboard(initialLeaderboard); // Remet uniquement les utilisateurs initiaux
    setPage(1); // Revenir à la première page
  };

  return (
    <div className="bg-[#F5F5F5] border border-gray-300 rounded-lg shadow-lg shadow-gray-400 p-6 w-full md:w-[550px] h-auto mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center md:text-left">
        Classement
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="text-gray-500 hidden md:table-row">
              <th className="pb-2 w-1/5">Position</th>
              <th className="pb-2 w-1/5">Username</th>
              <th className="pb-2 w-1/5">Points</th>
              <th className="pb-2 w-1/5">Parties jouées</th>
              <th className="pb-2 w-1/5">Victoires</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 hidden md:table-row"
              >
                <td className="py-2 flex justify-center">
                  {getMedalIcon(index + 1)}
                </td>
                <td className="text-purple-700 font-semibold">
                  {user.username}
                </td>
                <td>{user.points}</td>
                <td>{user.totalDuelsPlayed}</td>
                <td>{user.totalWins}</td>
              </tr>
            ))}
            {/* Disposition alternative pour mobile */}
            {leaderboard.map((user, index) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 md:hidden flex flex-col space-y-2 py-4 px-2 bg-white shadow-sm rounded-lg mb-4"
              >
                <td className="flex justify-between">
                  <span className="font-semibold text-gray-600">
                    Position :
                  </span>
                  <span className="text-gray-800">{index + 1}</span>
                </td>
                <td className="flex justify-between">
                  <span className="font-semibold text-gray-600">
                    Username :
                  </span>
                  <span className="text-purple-700 font-semibold">
                    {user.username}
                  </span>
                </td>
                <td className="flex justify-between">
                  <span className="font-semibold text-gray-600">Points :</span>
                  <span className="text-gray-800">{user.points}</span>
                </td>
                <td className="flex justify-between">
                  <span className="font-semibold text-gray-600">
                    Parties jouées :
                  </span>
                  <span className="text-gray-800">{user.totalDuelsPlayed}</span>
                </td>
                <td className="flex justify-between">
                  <span className="font-semibold text-gray-600">
                    Victoires :
                  </span>
                  <span className="text-gray-800">{user.totalWins}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Boutons Voir plus et Voir moins */}
      <div className="flex justify-center mt-4 space-x-4">
        {page < totalPages && (
          <button
            onClick={handleLoadMore}
            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700"
          >
            Voir plus
          </button>
        )}
        {page > 1 && (
          <button
            onClick={handleLoadLess}
            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
          >
            Voir moins
          </button>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
