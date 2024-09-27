import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const PlayerSelect = ({ onSelectPlayer, selectedPlayer }) => {
  // Ajout de `selectedPlayer` en prop
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_URL_LOCAL
      : process.env.REACT_APP_API_URL_NETWORK;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/users`);
        const playerOptions = response.data.map((player) => ({
          value: player._id, // L'ID du joueur comme value
          label: player.username, // Le username à afficher
        }));
        setPlayers(playerOptions); // Mettre à jour les joueurs
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des joueurs");
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [API_URL]);

  if (loading) {
    return <p>Chargement des joueurs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Select
        options={players}
        onChange={onSelectPlayer}
        value={selectedPlayer} // Associer l'état `selectedPlayer` à la valeur du composant Select
        placeholder="Sélectionnez un joueur..."
        isSearchable={true}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
      />
    </div>
  );
};

export default PlayerSelect;
