import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import CreateDuel from "./CreateDuel";
import PendingDuels from "./PendingDuels";
import DuelQuestion from "./DuelQuestion";
import ResetDuelsButton from "./ResetDuelsButton";
import DuelHistory from "./DuelHistory";

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
        <>
          <Dashboard /> {/* Utilisation du composant Dashboard */}
        </>
      ) : (
        <p>No user information available.</p>
      )}

      <CreateDuel />
      <PendingDuels userId={userInfo._id} />

      {duels.length > 0 ? (
        duels.map((duel) => <DuelQuestion key={duel._id} duelId={duel._id} />)
      ) : (
        <p>Aucun duel en cours.</p>
      )}

      <ResetDuelsButton />
      <DuelHistory userId={userInfo._id} />
    </div>
  );
};

export default Profile;
