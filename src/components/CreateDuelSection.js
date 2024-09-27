import React from "react";
import CreateDuel from "./CreateDuel";
import PendingDuels from "./PendingDuels"; // Import du composant PendingDuels

const CreateDuelSection = () => {
  return (
    <div className="bg-[#F5F5F5] mx-auto max-w-[1440px] flex flex-col items-center justify-center mt-12">
      {/* Ligne de séparation */}
      <div className="w-full border-t border-gray-300"></div>

      {/* Section Création de Duel et Duels en attente */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-8 md:w-[800px] lg:w-full px-4">
        {/* Composant CreateDuel */}
        <div className="w-full md:w-1/2">
          <CreateDuel />
        </div>

        {/* Composant PendingDuels */}
        <div className="w-full md:w-1/2">
          <PendingDuels />
        </div>
      </div>

      {/* Ligne de séparation */}
      <div className="w-full border-t border-gray-300 mt-12"></div>
    </div>
  );
};

export default CreateDuelSection;
