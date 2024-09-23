import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import Leaderboard from "./Leaderboard";
import { useSelector } from "react-redux";
import axios from "axios";

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [rank, setRank] = useState("N/A");
  const API_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_URL_LOCAL
      : process.env.REACT_APP_API_URL_NETWORK;

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/users`);
        const allUsersData = await response.data;

        const sortedUsers = allUsersData.sort((a, b) => b.points - a.points);

        const userRank =
          sortedUsers.findIndex(
            (user) => String(user._id) === String(userInfo._id)
          ) + 1;

        setRank(userRank || "N/A");
      } catch (error) {
        console.error("Erreur lors de la récupération du classement :", error);
      }
    };

    if (userInfo) {
      fetchRanking();
    }
  }, [userInfo, API_URL]);

  return (
    <div className="container mx-auto max-w-[1440px] flex justify-center mt-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {userInfo && (
          <ProfileCard
            username={userInfo.username}
            memberSince={new Date(userInfo.createdAt).toLocaleDateString()}
            gamesPlayed={userInfo.totalDuelsPlayed || 0}
            gamesWon={userInfo.totalWins || 0}
            rank={rank}
            points={userInfo.points || 0}
          />
        )}
        <Leaderboard />
      </div>
    </div>
  );
};

export default Dashboard;
