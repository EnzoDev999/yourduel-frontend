import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import LeftArrowIcon from "../assets/icon/leftArrow-icon.svg";
import RightArrowIcon from "../assets/icon/rightArrow-icon.svg";

const DuelHistory = ({ userId }) => {
  const [duelHistory, setDuelHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_URL_LOCAL
      : process.env.REACT_APP_API_URL_NETWORK;

  useEffect(() => {
    const fetchDuelHistory = async (page = 1) => {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/duelHistory/${userId}?page=${page}&limit=1`
        );
        setDuelHistory(response.data.duels);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération de l'historique des duels");
        setLoading(false);
      }
    };

    fetchDuelHistory(currentPage);

    const socket = io(API_URL);
    socket.emit("joinRooms", { userId, duelId: null });

    socket.on("duelCompleted", () => {
      fetchDuelHistory(currentPage);
    });

    return () => {
      socket.off("duelCompleted");
    };
  }, [API_URL, userId, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <p>Chargement de l'historique des duels...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (duelHistory.length === 0) {
    return <p>Aucun duel joué.</p>;
  }

  const getResultColor = (result) => {
    switch (result) {
      case "win":
        return "text-green-500";
      case "loss":
        return "text-red-500";
      case "draw":
        return "text-orange-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="duel-history-section mx-auto max-w-[1440px] flex flex-col items-center justify-center mt-12 pb-12 px-4 md:px-0">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300 w-full md:w-[800px]">
        <h2 className="text-xl font-bold text-center text-[#7D3C98] mb-6">
          Historique des Duels
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
          {totalPages > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <img src={LeftArrowIcon} alt="Précédent" className="w-6 h-6" />
            </button>
          )}

          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300 w-full md:w-auto">
            {duelHistory.map((duel, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold text-[#7D3C98]">
                  Adversaire :{" "}
                  <span className="text-gray-600">{duel.opponentUsername}</span>
                </p>
                <p className="font-semibold text-[#7D3C98]">
                  Question :{" "}
                  <span className="text-gray-600">{duel.question}</span>
                </p>
                <p className="font-semibold text-[#7D3C98]">
                  Votre réponse :{" "}
                  <span className="text-gray-600">{duel.userAnswer}</span>
                </p>
                <p className="font-semibold text-[#7D3C98]">
                  Bonne réponse :{" "}
                  <span className="text-green-600">{duel.correctAnswer}</span>
                </p>
                <p className="font-semibold text-[#7D3C98]">
                  Résultat :{" "}
                  <span className={getResultColor(duel.result)}>
                    {duel.result === "win"
                      ? "Victoire"
                      : duel.result === "loss"
                      ? "Défaite"
                      : "Égalité"}
                  </span>
                </p>
                <p className="font-semibold text-[#7D3C98]">
                  Points gagnés :{" "}
                  <span className="text-gray-600">{duel.pointsGained}</span>
                </p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <img src={RightArrowIcon} alt="Suivant" className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuelHistory;
