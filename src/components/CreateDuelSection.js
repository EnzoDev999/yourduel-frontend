import React from "react";
import CreateDuel from "./CreateDuel";
import PendingDuels from "./PendingDuels"; // Import du composant PendingDuels

const CreateDuelSection = () => {
  return (
    <div className="bg-[#F5F5F5] mx-auto max-w-[1440px] flex flex-col justify-center mt-12">
      {/* Ligne de séparation */}
      <div className="w-full border-t border-gray-300 max-w-[1440px]"></div>

      {/* Section Création de Duel et Duels en attente */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-12">
        {/* Composant CreateDuel */}
        <div className="w-1/2">
          <CreateDuel />
        </div>

        {/* Composant PendingDuels */}
        <div className="w-1/2">
          <PendingDuels />
        </div>
      </div>
    </div>
  );
};

export default CreateDuelSection;
