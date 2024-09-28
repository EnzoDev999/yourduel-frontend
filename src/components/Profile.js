import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import DuelManagement from "./DuelManagement";
import DuelQuestion from "./DuelQuestion";
import DuelHistory from "./DuelHistory";

const Profile = () => {
  const { isAuthenticated, userInfo, status, error } = useSelector(
    (state) => state.user
  );

  // const duels = useSelector((state) =>
  //   state.duel.duels.filter(
  //     (duel) =>
  //       duel.status === "accepted" &&
  //       (duel.challenger === userInfo._id || duel.opponent === userInfo._id)
  //   )
  // );

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

      <DuelManagement />

      {/* Ligne de séparation
      <div className="border-t border-gray-300 max-w-[1440px] flex flex-col justify-center mt-12"></div> */}

      {/* Section Duels en cours */}
      <DuelQuestion />

      <DuelHistory userId={userInfo._id} />
    </div>
  );
};

export default Profile;
