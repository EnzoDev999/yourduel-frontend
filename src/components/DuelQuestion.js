import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitAnswer,
  setQuestion,
  removeDuel,
} from "../redux/slices/duelSlice";
import { io } from "socket.io-client";
import LeftArrowIcon from "../assets/icon/leftArrow-icon.svg"; // Icônes pour navigation
import RightArrowIcon from "../assets/icon/rightArrow-icon.svg";

const API_URL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_API_URL_LOCAL
    : process.env.REACT_APP_API_URL_NETWORK;

const DuelQuestion = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [currentDuelIndex, setCurrentDuelIndex] = useState(0);
  const [duelResult, setDuelResult] = useState(null); // Pour afficher le résultat final
  const [showResult, setShowResult] = useState(false); // Pour afficher le message temporairement

  // Sélection des duels avec des questions en cours
  const duels = useSelector((state) =>
    state.duel.duels.filter((duel) => duel.status === "accepted")
  );

  const duel = duels[currentDuelIndex]; // Duel actuel

  useEffect(() => {
    const socket = io(API_URL);

    socket.emit("joinRooms", { userId });

    socket.on("duelAccepted", (updatedDuel) => {
      dispatch(
        setQuestion({
          duelId: updatedDuel._id,
          question: updatedDuel.question,
          options: updatedDuel.options,
          correctAnswer: updatedDuel.correctAnswer,
        })
      );
    });

    socket.on("duelCompleted", (updatedDuel) => {
      // Mise à jour du résultat final
      if (updatedDuel.status === "completed") {
        if (updatedDuel.winner === userId) {
          setDuelResult("Vous avez gagné !");
        } else if (updatedDuel.winner === "draw") {
          setDuelResult("Égalité !");
        } else {
          setDuelResult("Vous avez perdu !");
        }

        // Affiche le résultat pendant 5 secondes
        setShowResult(true);
        setTimeout(() => {
          dispatch(removeDuel(updatedDuel._id)); // Supprime le duel après 5 secondes
          setShowResult(false); // Cache l'affichage du résultat
        }, 5000);
      }

      dispatch(
        setQuestion({
          duelId: updatedDuel._id,
          question: updatedDuel.question,
          options: updatedDuel.options,
          correctAnswer: updatedDuel.correctAnswer,
          status: updatedDuel.status,
          winner: updatedDuel.winner,
        })
      );
    });

    return () => {
      socket.off("duelAccepted");
      socket.off("duelCompleted");
    };
  }, [dispatch, userId]);

  const handleSubmit = () => {
    if (duel && submittedAnswers[duel._id] && userId) {
      dispatch(
        submitAnswer({
          duelId: duel._id,
          userId,
          answer: submittedAnswers[duel._id].selectedOption,
        })
      )
        .unwrap()
        .then(() => {
          setSubmittedAnswers({
            ...submittedAnswers,
            [duel._id]: {
              ...submittedAnswers[duel._id],
              isSubmitted: true,
            },
          });
          setFeedbacks({
            ...feedbacks,
            [duel._id]:
              submittedAnswers[duel._id].selectedOption === duel.correctAnswer
                ? "Correct!"
                : `Incorrect. La bonne réponse était : ${duel.correctAnswer}`,
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la soumission de la réponse :", error);
        });
    }
  };

  const handleSelectOption = (option) => {
    setSubmittedAnswers({
      ...submittedAnswers,
      [duel._id]: {
        selectedOption: option,
        isSubmitted: false,
      },
    });
  };

  const nextDuel = () => {
    setCurrentDuelIndex((currentDuelIndex + 1) % duels.length);
  };

  const prevDuel = () => {
    setCurrentDuelIndex((currentDuelIndex - 1 + duels.length) % duels.length);
  };

  if (!duel) {
    return <p>Aucun duel en cours.</p>;
  }

  const selectedOption = submittedAnswers[duel._id]?.selectedOption || "";
  const isSubmitted = submittedAnswers[duel._id]?.isSubmitted || false;
  const feedback = feedbacks[duel._id] || "";

  return (
    <div className="duel-question-section mx-auto max-w-[1440px] flex flex-col items-center justify-center mt-12">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300 w-[800px]">
        <h2 className="text-xl font-bold text-center text-[#7D3C98] mb-6">
          Duels en cours
        </h2>

        {/* Affichage du message de résultat pendant 5 secondes */}
        {showResult && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300 mb-4 text-center">
            <p className="text-lg font-semibold text-center text-[#7D3C98] mb-4">
              {duelResult}
            </p>
          </div>
        )}

        {/* Navigation et affichage de la question */}
        {!showResult && (
          <div className="flex justify-center items-center space-x-4">
            {/* Flèche pour question précédente */}
            {duels.length > 1 && (
              <button onClick={prevDuel}>
                <img src={LeftArrowIcon} alt="Previous" className="w-6 h-6" />
              </button>
            )}
            {/* Carte de question */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300 w-full">
              <p className="text-lg font-semibold text-center text-[#7D3C98] mb-4">
                {duel.question}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {duel.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(option)}
                    disabled={isSubmitted}
                    className={`py-3 rounded-lg border border-gray-300 text-center ${
                      selectedOption === option
                        ? "bg-[#7D3C98] text-white"
                        : "bg-white text-gray-600"
                    } ${
                      isSubmitted &&
                      option === duel.correctAnswer &&
                      "bg-green-500 text-black"
                    } ${
                      isSubmitted &&
                      selectedOption === option &&
                      selectedOption !== duel.correctAnswer &&
                      "bg-red-500 text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!selectedOption || isSubmitted}
                className={`bg-[#7D3C98] text-white py-2 px-6 rounded-full w-full font-semibold ${
                  !selectedOption || isSubmitted
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#663399]"
                }`}
              >
                {isSubmitted ? "Réponse soumise" : "Valider"}
              </button>
              {feedback && (
                <p className="mt-4 text-center text-lg font-semibold text-gray-700">
                  {feedback}
                </p>
              )}
            </div>
            {/* Flèche pour question suivante */}
            {duels.length > 1 && (
              <button onClick={nextDuel}>
                <img src={RightArrowIcon} alt="Next" className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DuelQuestion;
