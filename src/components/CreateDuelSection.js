import React from "react";
import CreateDuel from "./CreateDuel";

const CreateDuelSection = () => {
  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col items-center mt-12">
      {/* Ligne de séparation */}
      <div className="w-full border-t border-gray-300 max-w-[1440px]"></div>

      {/* Section Création de Duel */}
      <div className="flex justify-center mt-8">
        <CreateDuel />
      </div>
    </div>
  );
};

export default CreateDuelSection;
