import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDuels,
  deleteDuel,
  acceptDuel,
  removeDuel,
} from "../redux/slices/duelSlice";
import { io } from "socket.io-client";
import LeftArrowIcon from "../assets/icon/leftArrow-icon.svg";
import RightArrowIcon from "../assets/icon/rightArrow-icon.svg";

const API_URL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_API_URL_LOCAL
    : process.env.REACT_APP_API_URL_NETWORK;

const PendingDuels = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id);
  const duels = useSelector((state) => state.duel.duels);

  // Indices pour naviguer dans les duels
  const [sentIndex, setSentIndex] = useState(0);
  const [receivedIndex, setReceivedIndex] = useState(0);

  // Filtrer les duels envoyés et reçus
  const sentDuels = duels.filter(
    (duel) => duel.challenger === userId && duel.status === "pending"
  );
  const receivedDuels = duels.filter(
    (duel) => duel.opponent === userId && duel.status === "pending"
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchDuels(userId));
    }

    const socket = io(API_URL);

    socket.emit("joinRooms", { userId, duelId: null });

    socket.on("duelReceived", () => {
      dispatch(fetchDuels(userId));
    });

    socket.on("duelAccepted", () => {
      dispatch(fetchDuels(userId));
    });

    socket.on("duelCancelled", (cancelledDuelId) => {
      dispatch(removeDuel(cancelledDuelId));
    });

    return () => {
      socket.off("duelReceived");
      socket.off("duelAccepted");
      socket.off("duelCancelled");
    };
  }, [dispatch, userId]);

  // Fonctions pour naviguer dans les duels envoyés et reçus
  const nextSentDuel = () => {
    setSentIndex((sentIndex + 1) % sentDuels.length); // Revenir au début après la fin
  };

  const prevSentDuel = () => {
    setSentIndex((sentIndex - 1 + sentDuels.length) % sentDuels.length); // Revenir à la fin après le début
  };

  const nextReceivedDuel = () => {
    setReceivedIndex((receivedIndex + 1) % receivedDuels.length);
  };

  const prevReceivedDuel = () => {
    setReceivedIndex(
      (receivedIndex - 1 + receivedDuels.length) % receivedDuels.length
    );
  };

  const handleCancelDuel = (duelId) => {
    dispatch(deleteDuel(duelId));
  };

  const handleAcceptDuel = async (duelId) => {
    try {
      await dispatch(acceptDuel(duelId)).unwrap();
    } catch (error) {
      console.error("Erreur lors de l'acceptation du duel :", error);
    }
  };

  return (
    <div className="duels-en-attente-section w-[800px] p-8 bg-white rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#7D3C98]">
        Duels en attente
      </h2>
      <div className="flex justify-center space-x-8">
        {/* Duels envoyés */}
        <div className="duel-slider flex flex-col items-center w-1/2">
          <h3 className="font-semibold text-[#7D3C98] mb-4">Duels envoyés</h3>
          {sentDuels.length > 0 ? (
            <div className="flex items-center space-x-4">
              {sentDuels.length > 1 && (
                <button onClick={prevSentDuel}>
                  <img src={LeftArrowIcon} alt="Previous" className="w-6 h-6" />
                </button>
              )}
              <div className="duel-card bg-gray-50 p-6 shadow-lg rounded-lg border border-gray-300">
                <p className="font-semibold text-[#7D3C98]">Catégorie :</p>
                <p className="text-gray-600 mb-2">
                  {sentDuels[sentIndex].category}
                </p>
                <p className="font-semibold text-[#7D3C98]">Envoyé à :</p>
                <p className="text-gray-600 mb-2">
                  {sentDuels[sentIndex].opponentUsername}
                </p>
                <p className="font-semibold text-[#7D3C98]">Status :</p>
                <p className="text-gray-600 mb-4">En attente de réponse</p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleCancelDuel(sentDuels[sentIndex]._id)}
                >
                  Annuler le Duel
                </button>
              </div>
              {sentDuels.length > 1 && (
                <button onClick={nextSentDuel}>
                  <img src={RightArrowIcon} alt="Next" className="w-6 h-6" />
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Aucun duel en attente de réponse.</p>
          )}
        </div>

        {/* Ligne de séparation verticale */}
        <div className="w-px bg-gray-300"></div>

        {/* Duels reçus */}
        <div className="duel-slider flex flex-col items-center w-1/2">
          <h3 className="font-semibold text-[#7D3C98] mb-4">Duels reçus</h3>
          {receivedDuels.length > 0 ? (
            <div className="flex items-center space-x-4">
              {receivedDuels.length > 1 && (
                <button onClick={prevReceivedDuel}>
                  <img src={LeftArrowIcon} alt="Previous" className="w-6 h-6" />
                </button>
              )}
              <div className="duel-card bg-gray-50 p-6 shadow-lg rounded-lg border border-gray-300">
                <p className="font-semibold text-[#7D3C98]">Catégorie :</p>
                <p className="text-gray-600 mb-2">
                  {receivedDuels[receivedIndex].category}
                </p>
                <p className="font-semibold text-[#7D3C98]">Adversaire :</p>
                <p className="text-gray-600 mb-4">
                  {receivedDuels[receivedIndex].challengerUsername}
                </p>
                <div className="flex space-x-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() =>
                      handleAcceptDuel(receivedDuels[receivedIndex]._id)
                    }
                  >
                    Accepter
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() =>
                      handleCancelDuel(receivedDuels[receivedIndex]._id)
                    }
                  >
                    Refuser
                  </button>
                </div>
              </div>
              {receivedDuels.length > 1 && (
                <button onClick={nextReceivedDuel}>
                  <img src={RightArrowIcon} alt="Next" className="w-6 h-6" />
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              Vous n'avez pas de duels reçus en attente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingDuels;
