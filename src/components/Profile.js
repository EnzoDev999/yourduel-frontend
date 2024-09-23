import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import CreateDuel from "./CreateDuel";
import PendingDuels from "./PendingDuels";
import DuelQuestion from "./DuelQuestion";
import ResetDuelsButton from "./ResetDuelsButton";
import DuelHistory from "./DuelHistory";
import Leaderboard from "./Leaderboard";
import ProfileCard from "./ProfileCard";
import axios from "axios";

const Profile = () => {
  const { isAuthenticated, userInfo, status, error } = useSelector(
    (state) => state.user
  );

  const duels = useSelector((state) =>
    state.duel.duels.filter(
      (duel) =>
        duel.status === "accepted" &&
        (duel.challenger === userInfo._id || duel.opponent === userInfo._id)
    )
  );

  const [rank, setRank] = useState("N/A");
  const API_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_URL_LOCAL
      : process.env.REACT_APP_API_URL_NETWORK;

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        // Utilisation de la route `/users`
        const response = await axios.get(`${API_URL}/api/auth/users`);
        const allUsersData = await response.data;

        // Trier les utilisateurs par points
        const sortedUsers = allUsersData.sort((a, b) => b.points - a.points);

        // Trouver l'index de l'utilisateur connecté, comparer les identifiants sous forme de chaînes
        const userRank =
          sortedUsers.findIndex(
            (user) => String(user._id) === String(userInfo._id)
          ) + 1;

        // Mettre à jour le rang dans l'état local
        setRank(userRank || "N/A");
      } catch (error) {
        console.error("Erreur lors de la récupération du classement :", error);
      }
    };

    fetchRanking();
  }, [userInfo, API_URL]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!isAuthenticated) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Navbar />
      {userInfo ? (
        <div>
          {/* Composant ProfileCard */}
          <ProfileCard
            username={userInfo.username}
            memberSince={new Date(userInfo.createdAt).toLocaleDateString()} // Convertir la date
            gamesPlayed={userInfo.totalDuelsPlayed || 0} // Valeur par défaut si non disponible
            gamesWon={userInfo.totalWins || 0} // Valeur par défaut si non disponible
            rank={rank} // Rang calculé
            points={userInfo.points || 0} // Afficher les points
          />

          {/* Classement Général */}
          <Leaderboard />

          {/* Ajouter ici la création de duel */}
          <CreateDuel />

          {/* Ajouter ici les invitations en attente */}
          <PendingDuels userId={userInfo._id} />

          {/* Afficher ici les duels en cours */}
          {duels.length > 0 ? (
            duels.map((duel) => (
              <DuelQuestion key={duel._id} duelId={duel._id} />
            ))
          ) : (
            <p>Aucun duel en cours.</p>
          )}

          <ResetDuelsButton />
          {/* Ajouter l'historique des duels */}
          <DuelHistory userId={userInfo._id} />
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default Profile;
