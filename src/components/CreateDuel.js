import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDuel } from "../redux/slices/duelSlice";
import PlayerSelect from "./PlayerSelect";

const CreateDuel = () => {
  const [category, setCategory] = useState("Culture Générale");
  const [selectedOpponent, setSelectedOpponent] = useState(null); // L'adversaire sélectionné
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id); // Récupérer l'ID de l'utilisateur connecté

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedOpponent) {
      alert("Veuillez sélectionner un adversaire.");
      return;
    }

    const opponentId = selectedOpponent.value;

    // Créer un nouveau duel avec les informations minimales requises
    const newDuel = {
      challenger: userId, // ID de l'utilisateur connecté
      opponent: opponentId, // Utiliser l'ID de l'adversaire sélectionné
      category, // Catégorie choisie
    };

    dispatch(createDuel(newDuel));

    // Réinitialisation des champs après soumission
    setCategory("Culture Générale");
    setSelectedOpponent(null);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg shadow-gray-400 p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-purple-600 mb-4 text-center">
        Créer un nouveau Duel
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-semibold">
            Choisissez une catégorie
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="Culture Générale">Culture Générale</option>
            <option value="Science">Science</option>
            <option value="Histoire">Histoire</option>
            <option value="Sport">Sport</option>
            {/* Ajoutez d'autres catégories selon vos besoins */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-semibold">
            Choisissez un adversaire
          </label>
          <PlayerSelect
            onSelectPlayer={(player) => setSelectedOpponent(player)}
            selectedPlayer={selectedOpponent} // Associer l'état `selectedOpponent` à `PlayerSelect`
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700"
          >
            Lancer le Duel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDuel;
