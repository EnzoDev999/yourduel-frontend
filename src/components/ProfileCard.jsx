import React from "react";
import TrophyIcon from "../assets/icon/trophy-icon.svg"; // Import de l'icône trophée
import GamesIcon from "../assets/icon/Games-icon.svg"; // Import d'une autre icône
import RankIcon from "../assets/icon/medal-icon.svg"; // Import de l'icône de classement
import EditIcon from "../assets/icon/edit-icon.svg"; // Import de l'icône d'édition

const ProfileCard = ({
  username,
  memberSince,
  gamesPlayed,
  gamesWon,
  rank,
  points,
}) => {
  return (
    <div className="bg-[#F5F5F5] border border-gray-300 rounded-lg shadow-lg shadow-gray-400 p-6 w-[400px] h-[400px] mx-auto">
      {/* Section Avatar */}
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Profile</h2>
        <button className="text-purple-600 hover:text-purple-700">
          <img src={EditIcon} alt="Edit Icon" className="w-6 h-6" />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Avatar */}
          <div className="w-20 h-20 bg-purple-600 text-white text-3xl flex items-center justify-center rounded-full">
            {username[0].toUpperCase()}
          </div>
          {/* Petit badge */}
          <span className="absolute bottom-0.5 right-1 block w-5 h-5 bg-white rounded-full border-2 border-purple-600"></span>
        </div>

        {/* Nom d'utilisateur */}
        <h2 className="mt-4 text-xl font-semibold text-purple-700">
          {username}
        </h2>
        <p className="text-gray-500 text-sm">Membre depuis: {memberSince}</p>

        {/* Icônes avec informations */}
        <div className="mt-[90px] flex justify-between w-full">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full shadow-md">
              <img src={GamesIcon} alt="Games Icon" className="w-6 h-6" />
              <p className="text-purple-700 font-semibold">{gamesPlayed}</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full shadow-md">
              <img src={TrophyIcon} alt="Trophy Icon" className="w-6 h-6" />
              <p className="text-purple-700 font-semibold">{gamesWon}</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full shadow-md">
              <img src={RankIcon} alt="Rank Icon" className="w-6 h-6" />
              <p className="text-purple-700 font-semibold">{rank}</p>
            </div>
          </div>
        </div>

        {/* Points */}
        <p className="mt-7 text-purple-700 font-semibold">Points: {points}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
