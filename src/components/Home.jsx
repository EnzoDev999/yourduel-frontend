import React from "react";
import { useNavigate } from "react-router-dom";
import TrophyIcon from "../assets/icon/trophy-icon.svg";
import AvatarIcon from "../assets/icon/avatar-icon.svg";
import ListIcon from "../assets/icon/list-icon.svg";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="w-full bg-gradient-radial from-[#9B59B6] to-[#7D3C98] text-white">
        {/* Container pour limiter le contenu à 1440px et le centrer */}
        <div className="flex flex-col items-center justify-center h-[400px] w-full max-w-screen-xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-4">
            Testez vos connaissances en duel culturel !
          </h1>
          <p className="text-xl mb-6">
            Inscrivez-vous et défiez vos amis sur des quiz de culture générale
          </p>

          <div className="flex justify-center items-center space-x-4 mt-6">
            {/* Bouton "Se connecter" */}
            <button
              onClick={handleLogin}
              className="px-6 py-3 h-[48px] bg-white text-purple-700 rounded-md font-semibold text-lg hover:bg-gray-200"
            >
              Se connecter
            </button>

            {/* Bouton "S'inscrire" */}
            <button
              onClick={handleRegister}
              className="px-6 py-3 h-[48px] bg-[#4A47A3] text-white rounded-md font-semibold text-lg hover:bg-blue-700"
            >
              S’inscrire
            </button>
          </div>
        </div>
      </div>

      {/* Blocs Explicatifs */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-[60px]">
          {/* Carte 1 */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center w-[350px] h-[200px] mx-auto">
            <div className="flex justify-center mb-4">
              <img
                src={AvatarIcon}
                alt="Icone 1"
                className="w-12 h-12 text-[#7D3C98]"
              />
            </div>
            <h3 className="text-[#7D3C98] font-bold mb-2">
              Inscrivez-vous facilement !
            </h3>
            <p className="text-[#666666]">
              Créez un compte en quelques clics pour accéder aux quiz.
            </p>
          </div>

          {/* Carte 2 */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center w-[350px] h-[200px] mx-auto">
            <div className="flex justify-center mb-4">
              <img
                src={ListIcon}
                alt="Icone 2"
                className="w-12 h-12 text-[#7D3C98]"
              />
            </div>
            <h3 className="text-[#7D3C98] font-bold mb-2">
              Choisissez un thème
            </h3>
            <p className="text-[#666666]">
              Explorez plusieurs catégories de quiz pour tous les goûts.
            </p>
          </div>

          {/* Carte 3 */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center w-[350px] h-[200px] mx-auto">
            <div className="flex justify-center mb-4">
              <img
                src={TrophyIcon}
                alt="Icone 3"
                className="w-12 h-12 text-[#7D3C98]"
              />
            </div>
            <h3 className="text-[#7D3C98] font-bold mb-2">Défiez vos amis !</h3>
            <p className="text-[#666666]">
              Invitez vos amis à tester leurs connaissances et gagnez des
              points.
            </p>
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className="bg-[#D8BFD8] py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#7D3C98] mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Inscrivez-vous gratuitement et commencez à jouer en quelques
            minutes.
          </p>
          <button
            onClick={handleRegister} // Utilise la fonction pour rediriger vers l'inscription
            className="px-8 py-3 bg-[#4A47A3] text-white rounded-md text-lg font-semibold hover:bg-blue-700"
          >
            Rejoins-nous !
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
